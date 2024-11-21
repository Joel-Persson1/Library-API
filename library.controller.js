const Database = require("better-sqlite3");
const db = new Database("library.db");

function findBooks(req, res) {
  const { title, author } = req.query;

  // Base query and parameters
  let query = "SELECT * FROM books WHERE 1=1";
  const params = [];

  // Add filters dynamically
  if (title) {
    query += " AND title = ?";
    params.push(title);
  }
  if (author) {
    query += " AND author = ?";
    params.push(author);
  }

  try {
    // Prepare and execute query
    const stmt = db.prepare(query);
    const results = stmt.all(...params);

    if (results.length > 0) {
      return res.json(results);
    } else {
      return notFound(res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
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

  return notFound(res);
}

function postBook(req, res) {
  const { title, author, yearPublished, genre } = req.body;

  if (!title || !author || !yearPublished || !genre) {
    return res
      .status(400)
      .json({ message: "The body is missing or incomplete." });
  }

  try {
    const insertQuery = `
      INSERT INTO books (title, author, yearPublished, genre)
      VALUES (?, ?, ?, ?)
    `;

    const stmt = db.prepare(insertQuery);

    const result = stmt.run(title, author, yearPublished, genre);

    if (result.changes > 0) {
      return res.status(201).json({
        message: "The new book was successfully created.",
        bookId: result.lastInsertRowid,
      });
    } else {
      return res.status(500).json({ message: "Failed to create the book." });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
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
    return notFound(res);
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
    return notFound(res);
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

function notFound(res) {
  return res
    .status(404)
    .json({ message: "The book with that id was not found." });
}

module.exports = { findBooks, getBookById, postBook, putBook, deleteBook };
