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
  const { id } = req.params;

  const book = library.find((book) => book.id === +id);

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
    id: newId,
    title: title,
    author: author,
    yearPublished: Number(yearPublished),
    genre: genre,
  };

  library.push(newBook);
  return res.status(201).json({ newBook });
});

// PUT/UPDATE A EXCISTING BOOK
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const { title } = body;
  const { author } = body;
  const { yearPublished } = body;
  const { genre } = body;

  if (!title && !author && !yearPublished && !genre) {
    return res.status(400).json({ message: "The body is missing" });
  }

  const book = library.find((book) => book.id === id);

  if (!book) {
    return res
      .status(404)
      .json({ message: "The book with that id was not found." });
  }

  book.title = title;
  book.author = author;
  book.yearPublished = Number(yearPublished);
  book.genre = genre;

  return res.json(book);
});

// DELETE A EXCISTING BOOK
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  const book = library.find((book) => book.id === id);

  if (!book) {
    return res
      .status(404)
      .json({ message: "The bokk with that id was not found" });
  }

  library = library.filter((book) => book.id != id);

  return res.json({ message: "The book was removed successfully" });
});

// **** **** //

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
