const express = require('express');
const cors = require('cors'); // Importer le middleware CORS

const app = express();
const PORT = process.env.PORT || 3000;

// Activer CORS pour toutes les origines
app.use(cors());

// Middleware pour traiter les données JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const reservations = []; // Stockage des réservations en mémoire (temporaire)

// Endpoint pour obtenir toutes les réservations
app.get('/reservations', (req, res) => {
    res.json(reservations);
});

// Endpoint pour créer une réservation
app.post('/reserve', (req, res) => {
    const { name, timeRange } = req.body;

    if (!name || !timeRange) {
        return res.status(400).json({ error: 'Name and time range are required' });
    }

    reservations.push({ name, timeRange });
    res.status(201).json({ message: 'Reservation successful' });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
