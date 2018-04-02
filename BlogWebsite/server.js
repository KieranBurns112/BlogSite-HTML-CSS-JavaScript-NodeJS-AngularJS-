var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://postsDB:13DBPost@ds231529.mlab.com:31529/posts"; //DB hosted on mlab.com

var mydb;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  mydb = db.db('posts');
  mydb.createCollection('allposts', function(err, res) {
    if (err) throw err;
  });
});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/posts', (req, res) => {
  var cursor = mydb.collection('allposts').find().toArray(function(err, results) {
    res.send(results);
  })
})

app.post('/posts', (req, res) => {
  mydb.collection('allposts').save(req.body, (err, result) => {
      if (err) throw err;
    })
})

app.listen(3000);
