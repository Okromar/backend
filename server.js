const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Simule une base de données
let reservations = [];
let adminCredentials = { username: 'admin', password: 'password123' }; // À modifier pour plus de sécurité

// Middleware
app.use(bodyParser.json());

// Configuration CORS
const corsOptions = {
  origin: 'https://okromar.github.io', // Remplacez par votre domaine frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Routes

// 1. Récupérer les créneaux disponibles
app.get('/slots', (req, res) => {
  const start = 8 * 60; // 8:00 en minutes
  const end = 20 * 60; // 20:00 en minutes
  const interval = 5; // Intervalle de 5 minutes

  const slots = [];
  for (let time = start; time < end; time += interval) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }

  const availableSlots = slots.filter(slot => {
    return !reservations.some(reservation => reservation.slot === slot);
  });

  res.json(availableSlots);
});

// 2. Réserver un créneau
app.post('/reserve', (req, res) => {
  const { date, slot } = req.body;

  // Vérifie si le créneau est déjà réservé
  const isReserved = reservations.some(
    (r) => r.date === date && r.slot === slot
  );

  if (isReserved) {
    return res.status(400).json({ message: 'Ce créneau est déjà réservé.' });
  }

  reservations.push({ date, slot });
  res.status(200).json({ message: 'Réservation réussie !' });
});

// 3. Connexion administrateur
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    res.status(200).json({ message: 'Connexion réussie.' });
  } else {
    res.status(401).json({ message: 'Identifiants incorrects.' });
  }
});

// 4. Voir toutes les réservations (Admin)
app.get('/admin/reservations', (req, res) => {
  res.json(reservations);
});

// 5. Supprimer une réservation (Admin)
app.post('/admin/delete', (req, res) => {
  const { date, slot } = req.body;

  reservations = reservations.filter(
    (r) => !(r.date === date && r.slot === slot)
  );

  res.status(200).json({ message: 'Réservation supprimée.' });
});

// 6. Statistiques des réservations
app.get('/admin/statistics', (req, res) => {
  const stats = reservations.reduce((acc, r) => {
    acc[r.date] = (acc[r.date] || 0) + 1;
    return acc;
  }, {});

  res.json(stats);
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

