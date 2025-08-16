const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.json());

// Importation des routes
const { regd_users } = require("./router/auth_users.js");
const { general } = require("./router/general.js");

// Routes publiques
app.use("/", general);

// Routes utilisateurs authentifiés
app.use("/", regd_users);

// Lancement du serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
