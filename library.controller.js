const Database = require("better-sqlite3");
const db = new Database("library.db");

function findBooks(req, res) {
  const { title, author } = req.query;

  if (title && author) {
    const getTitleAuthorQuery = `
    SELECT * FROM books
    WHERE title = ?
    AND author = ?
    `;

    const stmt = db.prepare(getTitleAuthorQuery);
    const post = stmt.get(title, author);

    if (post) {
      return res.json(post);
    } else {
      return res.status(404).json({ message: "The book does not exist" });
    }
  }

  if (title) {
    const getTitleQuery = `
    SELECT * FROM books
    WHERE title = ?
    `;

    const stmt = db.prepare(getTitleQuery);
    const post = stmt.get(title);

    if (post) {
      return res.json(post);
    } else {
      return res.status(404).json({ message: "The book does not exist" });
    }
  }

  if (author) {
    const getAuthorQuery = `
    SELECT * FROM books
    WHERE author = ?
    `;

    const stmt = db.prepare(getAuthorQuery);
    const post = stmt.get(author);

    if (post) {
      return res.json(post);
    } else {
      return res.status(404).json({ message: "The book does not exist" });
    }
  }

  const getAllBooksQuery = `
  SELECT * FROM books
  `;
  const stmt = db.prepare(getAllBooksQuery);
  const post = stmt.all();

  return res.json(post);
}

function getBookById(req, res) {
  const { id } = req.params;

  const getBookById = `
  SELECT * FROM books
  WHERE book_id = ?
  `;

  const stmt = db.prepare(getBookById);
  const post = stmt.get(id);

  if (post) {
    return res.status(200).json(post);
  }

  return res.status(404).json({ message: "The book was not found." });
}

function postBook(req, res) {
  const body = req.body;

  if (!body.title || !body.author || !body.yearPublished || !body.genre) {
    return res
      .status(400)
      .json({ message: "The body is missing och incomplete." });
  }

  const insertQuery = `
  INSERT INTO books (title, author, yearPublished, genre)
  VALUES (?, ?, ?, ?)
  `;

  const stmt = db.prepare(insertQuery);
  stmt.run(body.title, body.author, body.yearPublished, body.genre);

  return res
    .status(201)
    .json({ message: "The new post was succesfully created." });
}

function putBook(req, res) {
  const { id } = req.params;
  const { body } = req;

  console.log(body);

  if (!body.title || !body.author || !body.yearPublished || !body.genre) {
    return res
      .status(400)
      .json({ message: "The body is missing och incomplete." });
  }

  if (!bookExists(id)) {
    return res
      .status(404)
      .json({ message: "The book with that id was not found." });
  }

  const PutPostQuery = `
  UPDATE books
  SET title = ?, author = ?, yearPublished = ?, genre = ?
  WHERE book_id = ?
  `;

  stmt = db.prepare(PutPostQuery);
  stmt.run([body.title, body.author, body.yearPublished, body.genre, id]);

  return res.status(200).json({ message: "The book was succesfully updated." });
}

function deleteBook(req, res) {
  const { id } = req.params;

  if (!bookExists(id)) {
    return res
      .status(404)
      .json({ message: "The book with that id was not found." });
  }

  const deleteBookQuery = `
  DELETE FROM books
  WHERE book_id = ?
  `;

  const stmt = db.prepare(deleteBookQuery);
  stmt.run([id]);

  return res.status(200).json({ message: "The book was deleted succefully." });
}

function bookExists(id) {
  const getBookByIdQuery = `
  SELECT * FROM books
  WHERE book_id = ?
  `;

  let stmt = db.prepare(getBookByIdQuery);
  const post = stmt.get(id);

  return post ? true : false;
}

module.exports = { findBooks, getBookById, postBook, putBook, deleteBook };
