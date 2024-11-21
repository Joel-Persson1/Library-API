const express = require("express");

const {
  findBooks,
  getBookById,
  postBook,
  putBook,
  deleteBook,
} = require("./library.controller.js");

const app = express();

app.use(express.json());

// **** ENDPOINTS **** //

// GET ALL BOOKS FROM SERVER OR SEARCH FOR AUTHOR/TITLE
app.get("/books", findBooks);

// GET A BOOK WITH ID AND AUTHOR OBJECT
app.get("/books/:id", getBookById);

// POST A NEW BOOK
app.post("/books", postBook);

// PUT/UPDATE A EXCISTING BOOK
app.put("/books/:id", putBook);

// DELETE A EXCISTING BOOK
app.delete("/books/:id", deleteBook);

// **** **** //

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
