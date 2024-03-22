const db = require("../index.js");
const TestModel = db.getViewModel('Tests');

module.exports = {
	findHard: function(req, res){
		res.json({
			message: "Vous avez obtenu la base de donnée (codé en dur) de l'API"
		});
	},
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
	}
}

