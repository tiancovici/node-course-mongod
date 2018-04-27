const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
   if(err) {
      return console.log('Unable to connect to MongoDB server');
   }
   console.log('Connected to MongoDB server');
   const db = client.db('TodoApp');

   // deleteMany
   // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(
   // (result) => {
   //    console.log(result);
   // });
   // deleteOne
   // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then(
   // (result) => {
   //    console.log(result);
   // });
   // findOneAndDelete

   db.collection('Users').find({name: 'Pchad'}).count().then((result) => {
      let totalDelete = result - 1;
      while(totalDelete) {
         db.collection('Users').findOneAndDelete({name: 'Pchad'}).then((result2) => {
            console.log(`Deleting ${result.ok} copy ${result - totalDelete}`);
         })
         .catch((e)=>{
            console.log(e);});
         totalDelete--;
      }
   })
   .catch((e)=>{
      console.log(e);})
   // db.collection('Todos').findOneAndDelete({completed: false}).then(
   // (result) => {
   //    console.log(result);
   // });
   // client.close();
});