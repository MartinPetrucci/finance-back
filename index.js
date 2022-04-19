require("./mongo.js");
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const items = require('./endpoints/items')
const users = require('./endpoints/users')
const app = express();
app.use(express.json());
app.use(cors());

app.use('/items', items)
app.use('/users', users)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

