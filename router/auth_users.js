const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = []; // stockage en mémoire
let books = require("../booksdb");

// Clé secrète JWT
const SECRET = "monsecretjwt";

// Middleware pour vérifier le token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide" });
        }
        req.user = user; // user contient { username }
        next();
    });
}

// 📌 Route d’inscription
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username et password requis" });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "Inscription réussie" });
});

// 📌 Task 6 : Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username et password requis" });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe invalide" });
    }

    // Génération du token
    const accessToken = jwt.sign({ username: user.username }, SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login réussi", token: accessToken });
});

// 📌 Task 7 : Ajouter / Modifier un review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // récupéré via JWT

    if (!books[isbn]) {
        return res.status(404).json({ message: "Livre introuvable" });
    }

    if (!review) {
        return res.status(400).json({ message: "Le champ review est requis" });
    }

    // Ajouter ou modifier l’avis
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Avis ajouté/modifié avec succès",
        book: books[isbn]
    });
});

// 📌 Task 8 : Supprimer un review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Livre introuvable" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Aucun avis trouvé pour cet utilisateur" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Avis supprimé avec succès" });
});

module.exports = { regd_users, users };
