const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
   if(err) {
      return console.log('Unable to connect to MongoDB server');
   }
   console.log('Connected to MongoDB server');
   const db = client.db('TodoApp');

   // db.collection('Todos').findOneAndUpdate(
   // {
   //    _id: new ObjectID("5ae341580ec153f7bc4768c1")
   // }, {
   //    $set:{
   //       completed:true
   //    },
   // }, {
   //    returnOriginal: false
   // }).then((result) => {
   //    console.log(result);
   // });
   db.collection('Users').findOneAndUpdate({
      name: 'Pchad'
   },
   {
      $set:{
         name: 'Mike'
      },
      $inc:{
         age: 1
      }
   },
   {
      returnOriginal: false
   }).then((result) => {
      console.log(result);
   })
   // client.close();
});