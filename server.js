const express = require('express');
const low = require('lowdb');
const shortid = require('shortid');
var bodyParser = require('body-parser')

const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');

const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [], users: [] })
  .write()

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/books', function(req, res) {
  res.render('book', {
    books: db.get('books').value()
  });
});

app.get('/users', function(req, res) {
  res.render('users/index', {
    users: db.get('users').value()
  });
});

app.get('/books/add', function(req, res) {
  res.render('add');
});

app.get('/users/add', function(req, res) {
  res.render('users/add');
});

app.get('/books/:id/delete', function(req, res) {
  var id = req.params.id;
  var item = db.get('books').find({ id: id }).value();
  var index = db.get('books').indexOf(item).value();
  
  db.get('books').splice(index, 1).write();
  
  res.redirect('back');
});

app.get('/users/:id/delete', function(req, res) {
  var id = req.params.id;
  var item = db.get('users').find({ id: id }).value();
  var index = db.get('users').indexOf(item).value();
  
  db.get('users').splice(index, 1).write();
  
  res.redirect('back');
});

app.get('/books/:id/update', function(req, res) {
  var id = req.params.id;
  res.render('update', {
    id: id
  });
});

app.get('/users/:id/update', function(req, res) {
  var id = req.params.id;
  res.render('users/update', {
    id: id
  });
});

app.post('/books/add', function(req, res) {
  var id = shortid.generate();
  var title = req.body.title;
  var des = req.body.description;
  db.get('books').push({ 
    id: id, 
    title: title,
    description: des
  }).write();
  
  res.redirect('/books');
});

app.post('/users/add', function(req, res) {
  var id = shortid.generate();
  var name = req.body.name;
  
  db.get('users').push({ 
    id: id, 
    name: name
  }).write();
  
  res.redirect('/users');
});

app.post('/books/:id/update', function(req, res) {
  var id = req.params.id;
  var title = req.body.newTitle;
  db.get('books').find({ id: id }).value().title = title;
  
  res.redirect('/books');
});

app.post('/users/:id/update', function(req, res) {
  var id = req.params.id;
  var name = req.body.newName;
  db.get('users').find({ id: id }).value().name = name;
  
  res.redirect('/users');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
