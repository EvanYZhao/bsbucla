const mongoose = require("mongoose");

// REMOVE FOR PRODUCTION
const USER = 'root';
const PASSWORD = 'Monkey';
// REMOVE FOR PRODUCTION

const URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.lm55sto.mongodb.net/project?retryWrites=true&w=majority`;

mongoose.connect(URI)
.then(() => {
  console.log('MongoDB connected.');
});

module.exports = { mongoose };