require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


let port = process.env.PORT;

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
   console.log(req.body.text);
   let todo = new Todo({
      text: req.body.text
   })

   todo.save().then((doc) => {
      res.send(doc);
   },
   (e) => {
      res.status(400).send(e);
   });

});

// Post /users
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


app.get('/todos', (req, res) => {
   Todo.find().then(
   (todos) => {
      res.send({todos});
   },
   (e) => res.status(400).send(e)
   );
});

// GET /todo/12341234
app.get('/todos/:id', (req, res) => {
   let id = req.params.id;
   console.log(id);
   // Vald id using isValid
   if(!ObjectID.isValid(id)){
      //404 - send back empty send
      res.status(404).send();
   }
   else // find by id
   {
      Todo.findById(id).then((todo) => {
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

app.delete('/todos/:id', (req, res) => {
   //Get the id
   let id = req.params.id;
   //Validate the id
   if(!ObjectID.isValid(id)) {
      //if not valid send 404
      res.status(404).send();
   }
   else {// remove todoo by id
      Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch('/todos/:id', (req, res) => {
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
   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo) {
         console.log('not found id');
         res.status(404).send();
      }
      else {
         res.send({todo})
      }
   }).catch((e)=> res.status(400).send());

});

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {app};