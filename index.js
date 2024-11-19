const express = require("express");

let { library, authors } = require("./server.js");

const app = express();

app.use(express.json());

// **** ENDPOINTS **** //

// GET ALL BOOKS FROM SERVER OR SEARCH FOR AUTHOR/TITLE
app.get("/books", (req, res) => {
  const { title, author } = req.query;
  let filteredBooks = library;

  if (title) {
    filteredBooks = filteredBooks.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (author) {
    filteredBooks = filteredBooks.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  return res.json(filteredBooks);
});

// GET A BOOK WITH ID AND AUTHOR OBJECT
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

  if (
    !body ||
    !body.title ||
    !body.author ||
    !body.yearPublished ||
    !body.genre
  ) {
    return res
      .status(400)
      .json({ message: "The body is missing or incomplete." });
  }

  const { title, author, yearPublished, genre } = body;
  const newId = library.length + 1;

  const newBook = {
    id: newId,
    title,
    author,
    yearPublished,
    genre,
  };

  library.push(newBook);
  return res.status(201).json({ newBook });
});

// PUT/UPDATE A EXCISTING BOOK
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, yearPublished, genre } = req.body;

  if (!title && !author && !yearPublished && !genre) {
    return res.status(400).json({ message: "The body is missing" });
  }

  const book = library.find((book) => book.id === +id);
  if (!book) {
    return res
      .status(404)
      .json({ message: "The book with that id was not found." });
  }

  if (title) book.title = title;
  if (author) book.author = author;
  if (yearPublished) book.yearPublished = yearPublished;
  if (genre) book.genre = genre;

  return res.json(book);
});

// DELETE A EXCISTING BOOK
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  const book = library.find((book) => book.id === +id);

  if (!book) {
    return res
      .status(404)
      .json({ message: "The bokk with that id was not found" });
  }

  library = library.filter((book) => book.id != +id);

  return res.json({ message: "The book was removed successfully" });
});

// **** **** //

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
