var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = "mongodb://postsDB:13DBPost@ds231529.mlab.com:31529/posts"; //DB hosted on mlab.com

var mydb;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  mydb = db.db('posts');
  mydb.createCollection('allposts', function(err, res) {
    if (err) throw err;
  });
  mydb.createCollection('allusers', function(err, res) {
    if (err) throw err;
  });
});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/posts', (req, res) => {
   mydb.collection('allposts').find().toArray(function(err, results) {
     if (err) throw err;
     res.send(results);
  });
});

app.get('/posts/:id', (req, res) => {
  mydb.collection('allposts').findOne({_id: mongodb.ObjectID( req.params.id)}, (err, result) => {
    if (err) throw err;
    res.send();
  });
});

app.post('/posts', (req, res) => {
  mydb.collection('allposts').save(req.body, (err, result) => {
      if (err) throw err;
      res.send();
    });
});

app.put('/posts/:id', (req, res) => {
  var updatePost = req.body;
  mydb.collection('allposts').updateOne({_id: mongodb.ObjectID( req.params.id)}, {
    $set: {"title" : updatePost.title, "content" : updatePost.content}
  }, (err, result) => {
    if (err) throw err;
    res.send();
  });
});

app.delete('/posts/:id',(req, res) => {
  mydb.collection('allposts').deleteOne({_id: mongodb.ObjectID( req.params.id)}, (err, result) => {
      if (err) throw err;
      res.send();
    });
});


app.get('/users', (req, res) => {
  mydb.collection('allusers').find().toArray(function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/users', (req, res) => {
  mydb.collection('allusers').save(req.body, (err, result) => {
      if (err) throw err;
      res.send();
    });
});

app.listen(3000);
