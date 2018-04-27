
let express = require('express');
let bodyParser = require('body-parser');

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
      console.log('Inside then error ');
      res.status(400).send(e);
   });
})

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});