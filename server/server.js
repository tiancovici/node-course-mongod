require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const {authenticate} = require('./middleware/authenticate');

let port = process.env.PORT;

let app = express();

app.use(bodyParser.json());

///////////////
//   Todos   //
///////////////

// POST - add todos
app.post('/todos', authenticate, (req, res) => {
  console.log(req.body.text);
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  },
  (e) => {
    res.status(400).send(e);
  });
});

// GET - get specific todos
app.get('/todos', authenticate, (req, res) => {
   Todo.find({
     _creator: req.user._id
   }).then(
   (todos) => {
      res.send({todos});
   },
   (e) => res.status(400).send(e)
   );
});

app.get('/todos/:id', authenticate, (req, res) => {
   let id = req.params.id;
   // Vald id using isValid
   if(!ObjectID.isValid(id)){
      //404 - send back empty send
      res.status(404).send();
   }
   else // find by id
   {
      Todo.findOne({
        _id: id,
        _creator: req.user._id
      }).then((todo) => {
         if(!todo) { // not found
            res.status(404).send();
         }
         else {  // found
            res.send({todo});
         }
      }).catch((e)=> {
         res.status(400).send()
      });
   }
});

// DELETE - delete specific todos
app.delete('/todos/:id', authenticate, (req, res) => {
   //Get the id
   let id = req.params.id;
   //Validate the id
   if(!ObjectID.isValid(id)) {
      //if not valid send 404
      res.status(404).send();
   }
   else {// remove todoo by id
      Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      }).then((todo) => {
         if(!todo) { //if no doc send 404
            res.status(404).send();
         } else { // if doc, send doc with 200
            res.send({todo});
         }
      }).catch((e) => { //error
         res.status(400).send();
      })
   }
});

// PATCH - update specific todos
app.patch('/todos/:id', authenticate, (req, res) => {
   let id = req.params.id;
   let body = _.pick(req.body, ['text', 'completed']);
   //Validate the id
   if(!ObjectID.isValid(id)) {
      console.log('invalid id');
      //if not valid send 404
      return res.status(404).send();
   }

   // Update complete based on complete property
   if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
   }
   else {
      body.completed = false;
      body.completedAt = null;
   }

   // Find and update
   Todo.findOneAndUpdate({_id: id, _creator: req.user._id},
      {$set: body}, {new: true}).then((todo) => {
      if(!todo) {
         console.log('not found id');
         res.status(404).send();
      }
      else {
         res.send({todo})
      }
   }).catch((e)=> res.status(400).send());

});

///////////////
//   Users   //
///////////////

// Post /users - Sign up
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch(
  (e)=> res.status(400).send(e)
  )

});
// GET - return user
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login - Login
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e)=> {
    res.status(400).send();
  })
});

// Delete - Logging Out
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {app};