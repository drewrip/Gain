var fs = require("fs");
var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var path = require("path")
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var server = require('http').createServer(require('express')());
var io  = require('socket.io').listen(server);

var availableStudios = [];

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'gain';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randId(){
  return getRandomInt(1048576).toString(16).padStart(5, "0");
}

function addId(id){
    availableStudios.push(id);
}

function freeStudio(id){
    for(i=0;i<availableStudios.length;i++){
        if(availableStudios[i] == id){
            availableStudios.splice(i, i+1);
        }
    }
}
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render('home');
});

app.get("/code", function(req, res){
    res.render('code');
});

app.get("/studio", function(req, res){
    const studioKey = randId();
    addId(studioKey);
    console.log(availableStudios);
    res.render('studio', {studioCode: studioKey});
    sock();
});

app.post("/subCode", function(req, res){
    console.log(availableStudios);
    console.log("Code Entered: " + req.body.sCode);
    var code = req.body.sCode;
    if(availableStudios.includes(code)){
        res.render("member", {confCode: code});
        sock();

    }
    else{
        res.render("code");
    }
});

app.get(/^socket.io.js$/, function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'TRUE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.sendfile('socket.io.js');
});

app.post("/free", function(req, res){
    freeStudio(req.body.freeCode);
    console.console.log(availableStudios);
    console.log("Freed " + req.body.freeCode)
});


function sock(){
    var channels = {};
    var sockets = {};

    /**
     * Users will connect to the signaling server, after which they'll issue a "join"
     * to join a particular channel. The signaling server keeps track of all sockets
     * who are in a channel, and on join will send out 'addPeer' events to each pair
     * of users in a channel. When clients receive the 'addPeer' even they'll begin
     * setting up an RTCPeerConnection with one another. During this process they'll
     * need to relay ICECandidate information to one another, as well as SessionDescription
     * information. After all of that happens, they'll finally be able to complete
     * the peer connection and will be streaming audio/video between eachother.
     */

    io.sockets.on('connection', function (socket) {
        socket.channels = {};
        sockets[socket.id] = socket;

        console.log("["+ socket.id + "] connection accepted");
        socket.on('disconnect', function () {
            for (var channel in socket.channels) {
                part(channel);
            }
            console.log("["+ socket.id + "] disconnected");
            delete sockets[socket.id];
        });


        socket.on('join', function (config) {
            console.log("["+ socket.id + "] join ", config);
            var channel = config.channel;
            var userdata = config.userdata;

            if (channel in socket.channels) {
                console.log("["+ socket.id + "] ERROR: already joined ", channel);
                return;
            }

            if (!(channel in channels)) {
                channels[channel] = {};
            }

            for (id in channels[channel]) {
                channels[channel][id].emit('addPeer', {'peer_id': socket.id, 'should_create_offer': false});
                socket.emit('addPeer', {'peer_id': id, 'should_create_offer': true});
            }

            channels[channel][socket.id] = socket;
            socket.channels[channel] = channel;
        });

        function part(channel) {
            console.log("["+ socket.id + "] part ");

            if (!(channel in socket.channels)) {
                console.log("["+ socket.id + "] ERROR: not in ", channel);
                return;
            }

            delete socket.channels[channel];
            delete channels[channel][socket.id];

            for (id in channels[channel]) {
                channels[channel][id].emit('removePeer', {'peer_id': socket.id});
                socket.emit('removePeer', {'peer_id': id});
            }
        }
        socket.on('part', part);

        socket.on('relayICECandidate', function(config) {
            var peer_id = config.peer_id;
            var ice_candidate = config.ice_candidate;
            console.log("["+ socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

            if (peer_id in sockets) {
                sockets[peer_id].emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
            }
        });
        socket.on('relaySessionDescription', function(config) {
            var peer_id = config.peer_id;
            var session_description = config.session_description;
            console.log("["+ socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

            if (peer_id in sockets) {
                sockets[peer_id].emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
            }
        });
    });
}

app.listen(8080);
