const express = require("express");

let { library } = require("./server.js");

const app = express();

app.use(express.json());

// **** ENDPOINTS **** //

// **** **** //

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
