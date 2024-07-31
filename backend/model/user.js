const mongoose = require('mongoose');

//to validate the unique email from the user
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema =
  new Schema({
    email: { type: String, required: true , unique:true},
    password: { type: String, required: true },
  }
  );


userSchema.plugin(uniqueValidator); //to validate the unique email from the user for each user inserted

module.exports = mongoose.model('User', userSchema);
