var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/newPost", newPost);

function newPost(req, res) {
  var post = req.body;
}

app.listen(3000);
