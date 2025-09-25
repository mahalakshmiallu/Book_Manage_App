const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow frontend requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// In-memory books
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "Harry Potter", author: "J.K. Rowling" }
];

// API routes

// GET all books
app.get("/books", (req, res) => res.json(books));

// POST a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: "Title and Author required" });

  const newBook = { id: books.length ? books[books.length - 1].id + 1 : 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT (edit) a book by ID
app.put("/books/:id", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (req.body.title) book.title = req.body.title;
  if (req.body.author) book.author = req.body.author;

  res.json({ message: "Book updated", book });
});

// DELETE a book by ID
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
});

// Root route (optional welcome message)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Start server
app.listen(PORT, () => console.log(`📚 Book App running on http://localhost:${PORT}`));
