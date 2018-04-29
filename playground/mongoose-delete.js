const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//    console.log(result);
// });
//
//
// Todo.findOneAndRemove({}).then((result) => {
//
// });

Todo.findOneAndRemove({_id: '5ae5db3e8f7badf35d5abf82'}).then((todo)=> {
   console.log(`${todo}`);
})

// Todo.findByIdAndRemove('5ae5db3e8f7badf35d5abf82').then((todo)=> {
//    console.log(`${todo}`);
// })