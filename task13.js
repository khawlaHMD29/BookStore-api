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
