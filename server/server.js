
let express = require('express');
let bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let port = 4200;


let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

   console.log('inside /todos');
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

})

app.get('/todos', (req, res) => {
   Todo.find().then(
   (todos) => {
      res.send({todos});
   },
   (e) => res.status(400).send(e)
   );
})

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
})

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {app};