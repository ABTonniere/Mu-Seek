const db = require("../index.js");
const TestModel = db.getViewModel('Tests');

module.exports = {
	// Comment envoyé des données à l'application ?
	findHard: function(req, res){
		res.json({
			message: "Vous avez obtenu la base de donnée (codé en dur) de l'API"
		});
	},
	// Comment obtenire des données de la base de donnée ?
	findMongo: async function(req, res){
		let tests;
		try {
			tests = await TestModel.find();
		} catch (err) {
			console.error("Erreur lors de la récupération des données depuis MongoDB :", err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des données depuis la base de données.", error: err });
		}

		try {
			res.json(tests);
		} catch (err) {
			console.error("Erreur lors du traitement des donnée :", err);
			res.status(500).json({ message: "Une erreur s'est produite lors du traitement des données, sur le server.", error: err });
		}
	},
	// Comment recevoire des données de l'application ?
	write: async function(req, res){
		try {
			// Récupérer les données de la requête GET
			const newData = req.query;
			// Insérer les données dans la nouvelle collection
			const result = await new TestModel(newData);
			res.json(result); // Renvoyer la réponse JSON
		} catch (err) {
			console.error('Erreur lors de l\'insertion de données dans la nouvelle collection :', err);
			res.status(500).send('Erreur serveur');
		}
	},
	// Comment sauvegardé des données dans la base de donnée
	write2: async function(req, res){
		let result
		try {
			result = await TestModel.create(req);
		} catch (err) {
			console.error('Erreur lors de l\'insertion de données dans la nouvelle collection :', err);
			res.status(500).send('Erreur serveur');
		}
		// Enregistrer la nouvelle entrée dans la collection
		result.save()
			.then((result) => {
				res.json({message: "Sauvegarde dans mongodb réussie.", result: result});
			})
			.catch((err) => {
				console.error('Erreur lors de l\'ajout de la nouvelle entrée :', err);
				res.json({message: "Erreur lors de l'envoie à mongodb.", error: err});
			});
	},
	// Comment modifier la base de données ?
	/* CHATGPT non-vérifier
	update: async function(req, res){
		try {
			const result = await TestModel.updateMany({ message: "Nouveau message" }, { message: "Nouveau message généré automatiquement" });
			res.json({ message: "Les données ont été modifiées avec succès", modifiedCount: result.nModified });
		} catch (err) {
			console.error('Erreur lors de la mise à jour de l\'élément dans la collection :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'élément dans la base de données.", error: err });
		}
	},
	*/
	// Comment supprimer des données de la base de données ?
	/* CHATGPT non-vérifier
	remove: async function(req, res){
		try {
			// Supprimer toutes les données avec le message spécifié
			const result = await TestModel.deleteMany({ message: "Nouveau message généré automatiquement" });
			res.json({ message: "Les données ont été supprimées avec succès", deletedCount: result.deletedCount });
		} catch (err) {
			console.error('Erreur lors de la suppression de l\'élément dans la collection :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'élément dans la base de données.", error: err });
		}
	},
	*/
	// Comment modifié un objet json en un autre {message:"abc", inutile:"oups"} => {message:"abc", defaut:"squo"}
	transform: function(req, res){
		try {
			const inputObject = req.query; // Objet JSON à transformer
			let outputObject = {
				message: inputObject.message,
				defaut: 'squo'
			};
			if (inputObject.hasOwnProperty('defaut')) {
				outputObject.defaut = inputObject.defaut;
			}
			res.json(outputObject); // Renvoyer l'objet JSON transformé
		} catch (err) {
			console.error('Erreur lors de la transformation de l\'objet JSON :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la transformation de l'objet JSON.", error: err });
		}
	},
	// Comment recevoir des donnée d'une API ? 'https://musicbrainz.org/ws/2/area?query=france&fmt=json' => json
	fetchDataFromAPI: async function(req, res){
		try {
			const axios = require('axios');
			const response = await axios.get('https://musicbrainz.org/ws/2/area?query=france&fmt=json');
			const data = response.data;
			res.json(data); // Renvoyer les données de l'API
		} catch (err) {
			console.error('Erreur lors de la récupération des données depuis l\'API externe :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des données depuis l'API externe.", error: err });
		}
	}
}

