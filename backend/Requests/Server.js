const express = require("express");
const cors = require("cors");
require('../MongoDB');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Requests Server started on ${PORT}.`);
});

module.exports = { app, PORT };