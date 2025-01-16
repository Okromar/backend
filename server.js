const express = require('express');
const app = express();

// Utilisez la variable d'environnement PORT ou un port par défaut (e.g. 3000)
const PORT = process.env.PORT || 3000;

// Exemple de route par défaut
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// L'application écoute sur le port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
