const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


let message = 'I am user number 3';

let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

//
//
// let data = {
//    id: 4
// };
//
// let secret = 'asdjiowq241';
// let token = {
//    data,
//    hash: SHA256(JSON.stringify(data) + secret).toString()
// };
//
// let resultHash = SHA256(JSON.stringify(token.data) + secret).toString();
// if( resultHash === token.hash) {
//    console.log('Data was not changed');
// } else {
//    console.log('Data was changed. Don\'t trust!');
// }

let data = {
   id:10
};

// Data, Secret
let secret = '123abc'
let token = jwt.sign(data, secret);
console.log(token);

let decoded = jwt.verify(token, secret);
console.log(decoded);