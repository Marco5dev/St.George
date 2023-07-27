const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var d2023Schema = new mongoose.Schema({
  social: {
    type: String,
    required: true,
    unique: false,
  },
  image: {
    type: String,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  rank: {
    type: String,
    required: true,
    unique: false,
  },
  competition: {
    type: String,
    required: true,
    unique: false,
  },
  date: {
    type: String,
    required: true,
    unique: false,
  },
  edu: {
    type: String,
    required: true,
    unique: false,
  },
});

//Export the model
module.exports = mongoose.model('d2023', d2023Schema);

