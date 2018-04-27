const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
   text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
   },
   completed: {
      type: Boolean,
      default: false
   },
   completedAt: {
      type: Number,
      default: null
   }
});

let User = mongoose.model('Users',{
   user: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
   }
});

new User({user: 'test_user',email: 'test@test.com'}).save().then((doc)=>{
   console.log(`Saved user: ${doc}`);
},(e)=> {
   console.log(`Unable to save: ${e}`);
});

//
// let newTodo = new Todo({
//    text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//    console.log(`Saved todo: ${doc}`);
// },(e)=> {
//    console.log(`Unable to save: ${e}`);
// });

// new Todo({
//    text: 'Eat Dinner',
//    completed: false
// }).save().then((doc) => {
//    console.log(`Saved todo: ${JSON.doc}`);
// },(e)=> {
//    console.log(`Unable to save: ${e}`);
// });

