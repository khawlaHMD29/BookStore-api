// general.js
const express = require('express');
const public_users = express.Router();
const books = require('../booksdb.js');

// Importer le tableau users depuis auth_users.js
let { users } = require("./auth_users.js");

// Middleware pour parser JSON
public_users.use(express.json());

// -----------------------------
// Tâche 1 : Retourner tous les livres
// -----------------------------
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// -----------------------------
// Tâche 2 : Obtenir un livre par ISBN
// -----------------------------
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Livre introuvable" });
});

// -----------------------------
// Tâche 3 : Obtenir tous les livres par auteur
// -----------------------------
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(
    b => b.author.toLowerCase() === author
  );
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
});

// -----------------------------
// Tâche 4 : Obtenir les livres par titre
// -----------------------------
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const matchedBooks = Object.values(books).filter(
    b => b.title.toLowerCase() === title
  );
  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  }
  return res.status(404).json({ message: "Aucun livre trouvé avec ce titre" });
});

// -----------------------------
// Tâche 5 : Obtenir les reviews d’un livre
// -----------------------------
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews || { message: "Pas d'avis disponible pour ce livre" });
  }
  return res.status(404).json({ message: "Livre introuvable" });
});

// -----------------------------
// Tâche 6 : Enregistrer un nouvel utilisateur
// -----------------------------
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "L'utilisateur existe déjà" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Utilisateur enregistré avec succès" });
});

// -----------------------------
// Tâche 10 : Obtenir tous les livres avec une fonction async callback
// -----------------------------
function getBooksAsync(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books) {
        resolve(books);
      } else {
        reject("Impossible de récupérer les livres");
      }
    }, 1000); // Simule un délai (1 seconde)
  }).then(data => callback(null, data))
    .catch(err => callback(err, null));
}

// Nouvelle route pour Task 10
public_users.get('/async/books', (req, res) => {
  getBooksAsync((err, data) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
    return res.status(200).json(data);
  });
});

// ------------------- Task 11 : Search by ISBN – Using Promises -------------------
function getBookByIsbnPromise(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = Object.values(books).find(b => b.isbn === isbn);
      if (book) {
        resolve(book); // succès
      } else {
        reject("Livre introuvable"); // erreur
      }
    }, 1000); // simulation d’un délai async
  });
}

public_users.get('/promise-isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  getBookByIsbnPromise(isbn)
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// ------------------- Task 12 : Search by Author using Promises -------------------
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.author.toLowerCase() === author.toLowerCase()
      );

      if (filteredBooks.length > 0) {
        resolve(filteredBooks); // succès
      } else {
        reject("Aucun livre trouvé pour cet auteur"); // erreur
      }
    }, 1000); // simulation async
  });
}

// Route pour chercher par auteur avec Promise
public_users.get('/promise-author/:author', (req, res) => {
  const author = req.params.author;

  getBooksByAuthor(author)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

// ------------------- Task 13 : Search by Title using Promises -------------------
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.title.toLowerCase() === title.toLowerCase()
      );

      if (filteredBooks.length > 0) {
        resolve(filteredBooks); // succès
      } else {
        reject("Aucun livre trouvé avec ce titre"); // erreur
      }
    }, 1000); // simulation async
  });
}

// Route pour chercher par titre avec Promise
public_users.get('/promise-title/:title', (req, res) => {
  const title = req.params.title;

  getBooksByTitle(title)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

module.exports = { general: public_users, users };
