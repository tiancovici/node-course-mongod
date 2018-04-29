const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
let id = '5ae52212e7b5756cafc0894';

// if(!ObjectID.isValid(id)){
//    console.log(`ID not valid`);
// }
// // Queries by id
// Todo.find({
//    _id: id
// }).then((todos) => {
//    console.log(`Todos: ${todos}`);
// });
//
//
// // Query first one
// Todo.findOne({
//    _id: id
// }).then((todos) => {
//    if(todos){
//       console.log(`Todos: ${todos}`);
//    } else {
//       console.log('Id not found');
//    }
// });

//Find by ID
// Todo.findById(id).then((todos) => {
//    if(todos){
//       console.log(`Todos: ${todos}`);
//    } else {
//       console.log('Id not found');
//    }
// }).catch((e) => {
//    console.log(e);
// })

let user_id = '5ae379ef71c36c3b8e62f9ce';
User.findById(user_id).then((user) => {
   if(!user){
      console.log('User not found');
   }
   else {
      console.log(`User: ${user}`);
   }
}).catch((e) => {
   console.log(`Error: ${e}`);
})