let {User} = require('./../models/user');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user) {
      console.log('Couldn\'t find user');
      return Promise.reject;
    }
    // Store data to pass to /users/me
    req.user = user;
    req.token = token;
    // Exit function and move to next use
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};