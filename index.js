const express = require("express");

let { library } = require("./server.js");

const app = express();

app.use(express.json());

// **** ENDPOINTS **** //

// GET ALL BOOKS FROM SERVER
app.get("/books", (req, res) => {
  res.json(library);
});

// GET A BOOK WITH ID
app.get("/books/:id", (req, res) => {
  const params = req.params;
  const id = params.id;

  const book = library.find((book) => book.id === id);

  if (!book) {
    return res
      .status(404)
      .json({ message: "The book with that id was not found" });
  }

  return res.json(book);
});

// POST A NEW BOOK
app.post("/books", (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({ message: "The body is missing." });
  }

  const title = body.title;
  const author = body.author;
  const yearPublished = body.yearPublished;
  const genre = body.genre;
  const newId = library.length + 1;

  const newBook = {
    id: newId.toString(),
    title: title,
    author: author,
    yearPublished: yearPublished,
    genre: genre,
  };

  library.push(newBook);
  return res.status(201).json({ newBook });
});

// **** **** //

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
