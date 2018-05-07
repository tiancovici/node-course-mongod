const {ObjectID} = require('mongodb');
const jwt  = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const secret = 'abc123';
const users = [{
  //Valid auth token
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, secret).toString()
  }]
},{
  //Invalid auth token
  _id: userTwoId,
  email: 'mead@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, secret).toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  completed: false,
  text: 'First test todo',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];


const populateTodos = (done) => {
  Todo.remove({}) //Remove all todos
    .then(() => { // Populate
    return Todo.insertMany(todos);
  }).then(() => done())
};

const populateUsers = (done) => {
  User.remove({})// Remove all users
  .then(()=> {   // Populate users
    let userOne = new User(users[0]).save(); //Save user, and get promise
    let userTwo = new User(users[1]).save();

    //Wait for all promises to resolve
    return Promise.all([userOne, userTwo]);
  }).then(()=> done());
};
module.exports = {todos, populateTodos, users, populateUsers};
