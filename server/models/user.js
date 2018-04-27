const mongoose = require('mongoose');

let User = mongoose.model('Users', {
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

module.exports= {User};