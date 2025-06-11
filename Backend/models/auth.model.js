const mongoose = require('mongoose');


 

const bcrypt = require('bcrypt');



 




 

const AuthSchema = new mongoose.Schema({


 

  username: {


 

    type: String,


 

    required: true,


 

    unique: true,


 

    trim: true,


 

    minlength: 3,


 

  },


 

  password: {


 

    type: String,


 

    required: true,


 

  },


 

  role: {


 

    type: String,


 

    enum: ['employee', 'manager', 'hr'],


 

    default: 'employee',


 

  },


 

  name:{


 

    type: String


 

  }


 

}, { timestamps: true });




 




 

// Method to compare password for login


 

AuthSchema.methods.comparePassword = async function (candidatePassword) {

  return bcrypt.compare(candidatePassword, this.password);

};



 




 

module.exports = mongoose.model('Auth', AuthSchema);