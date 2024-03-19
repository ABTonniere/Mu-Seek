const express = require('express');
const router = express.Router();
const db = require("../index.js");
const testController = db.getViewCtrl('Tests');

// Route pour récupérer tous les utilisateurs
router.get('/hard', async (req, res) => {
	res.json(testController.findHard);
});
router.get('/', async (req, res) => {
	res.json({message: "Ceci est l'accés à quelques test de création d'API et à la gestion de mongoDB."});
});

module.exports = router;

