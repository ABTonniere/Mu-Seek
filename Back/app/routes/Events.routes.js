const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/Events.controller');

// Route pour récupérer tous les utilisateurs
router.get('/test', async (req, res) => {
	res.json({ message: "Welcome to Mu-Seek application." });
});

module.exports = router;

