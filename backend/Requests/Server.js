const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// REMOVE FOR PRODUCTION
const USER = 'root';
const PASSWORD = 'Monkey';
// REMOVE FOR PRODUCTION

const PORT = process.env.PORT || 3001;

const URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.lm55sto.mongodb.net/project?retryWrites=true&w=majority`;

mongoose.connect(URI)
.then(() => {
  console.log('MongoDB connected.');
});

app.listen(PORT, () => {
  console.log(`Requests Server started on ${PORT}.`);
});

module.exports = { app, mongoose, PORT };