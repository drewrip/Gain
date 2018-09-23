var fs = require("fs");
var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var path = require("path")
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

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
});

app.post("/subCode", function(req, res){
    console.log(availableStudios);
    console.log("Code Entered: " + req.body.sCode);
    var code = req.body.sCode;
    if(availableStudios.includes(code)){
        res.render("member", {confCode: code});

    }
    else{
        res.render("code");
    }
});

app.post("/free", function(req, res){
    freeStudio(req.body.freeCode);
    console.console.log(availableStudios);
    console.log("Freed " + req.body.freeCode)
});
app.listen(8080);
