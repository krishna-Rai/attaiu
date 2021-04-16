const express = require("express");
require('dotenv').config()

require('./db/mongoose')
const router = require('./routers/router')
const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(router);
app.listen(port, () => {
  console.log("Server is listening on port: " + port);
});

