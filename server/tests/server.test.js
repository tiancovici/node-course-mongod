
const request = require('supertest');
const {ObjectID} = require('mongodb');
var {app} = require('../server');
const {Todo} = require('../models/todo');
const expect = require('expect');

const todos = [{
   _id: new ObjectID(),
   compelted: false,
   text: 'First test todo'
},{
   _id: new ObjectID(),
   text: 'Second test todo',
   completed: true,
   completedAt: 333
}];

// Delete all so we start with 0
beforeEach((done) => {
   Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
   }).then(() => done())
});

describe('POST /todos', () =>{

   it('should create a new todo', (done)=> {
      let text = 'Test todo text';

      request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
         expect(res.body.text).toBe(text);
      })
      .end((err, res)=> {
         if(err) {
            return done(err);
         }

         Todo.find({text}).then((todos) =>{
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
         }).catch((e) => done(e));
      })
   })

   it('should not create a new todo with bad data', (done) => {
      request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res)=> {
         if(err) {
            return done(err);
         }

         Todo.find().then((todos) =>{
            expect(todos.length).toBe(2);
            done();
         }).catch((e) => done(e));
      })
   })
})

describe('GET /todos', () => {
   it('should get all todos', (done) => {
      request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
         expect(res.body.todos.length).toBe(2);
      })
      .end(done);
   })
})

describe('GET /todos/:id', () => {
   it('should return todo doc', (done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=> {
         expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
   })

   it('should return a 404, if todo not found', (done) => {
      request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
   });

   it('should return a 404 for non-object ids', (done) => {
      request(app)
      .get(`/todos/1`)
      .expect(404)
      .end(done);
   });
})

describe('DELETE /todos/:id', () => {
   it('should remove a todo', (done)=> {
      let hexId = todos[1]._id.toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
         expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
         if(err) {
            done(err);
         } else {
           // Query database by id
            Todo.findById(hexId).then((todo) =>{
               expect(todo).toNotExist;
               done();
            }).catch((e) => done(e));
         };
      });
   });

   it('should return 404 if todo not found', (done) => {
      request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
   });

   it('should return 404 if object id is invalid', (done) => {
      request(app)
      .get(`/todos/1`)
      .expect(404)
      .end(done);
   });
})

describe('PATCH /todos/:id', () => {
   it('should update the todo', (done) => {
      //grab id of first item
      let hexId = todos[0]._id.toHexString();
      //update text, set completed true
      let text = 'This should be the new text';
      // make patch request
      request(app)
      .patch(`/todos/${hexId}`)
      .send({
         completed: true,
         text
      })
      .expect(200)
      .expect((res) => {
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(true);
         expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
   });

   it('should clear completedAt when todo is not compelted', (done) => {
      //grab id of second todo item
      let hexStringId = todos[1]._id.toHexString();
      let text = 'This is new text';
      request(app)
      .patch(`/todos/${hexStringId}`)
      //update text, set completed to false
      .send({
         completed: false,
         text
      })
      //expect 200
      .expect(200)
      .expect((res) => {
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(false);
         expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

      //text is changed, completed false, completedAt is null .toNotExist
   });

})