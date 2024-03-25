const axios = require('axios');

const creater = require("./importStandard.js");
const db = require("../index.js");
const model = db.getModel('Tests');

let verrou = false;
let nbBoucle = 0;

async function aleat(nom,i=0){
	const delai = Math.floor(Math.random() * (6-2)) + 2; // Entre 2 et 6 secondes
	// Afficher le délai choisi pour cet appel de la fonction
	console.log("Prochaine exécution de "+nom+" dans "+delai+" secondes");
	// Planifier l'exécution de la fonction avec le délai aléatoire
	if( i > 0 ){
		setTimeout(function() {
			// Votre code à exécuter ici
			console.log("La fonction "+nom+" est exécutée ! Encore "+i+" fois.");
			// Réexécuter la fonction pour le prochain délai aléatoire
			aleat(nom,i-1);
		}, delai * 1000);
	} else {
		setTimeout(function() {
			// Votre code à exécuter ici
			console.log("FIN : La fonction "+nom+" est exécutée pour la dernière fois !");
		}, delai * 1000);
	}
};

const getter = creater.getBy(model,"le test","message");

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
			tests = await model.find();
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
	// Comment recevoir des données de l'application ?
	write: async function(req, res){
		try {
			// Récupérer les données de la requête GET
			const newData = req.query;
			// Insérer les données dans la nouvelle collection
			const result = await new model(newData);
			res.json(result); // Renvoyer la réponse JSON
		} catch (err) {
			console.error('Erreur lors de l\'insertion de données dans la nouvelle collection :', err);
			res.status(500).send('Erreur serveur');
		}
	},
	// Comment sauvegarder des données dans la base de donnée
	write2: async function(req, res){
		let result
		try {
			result = await model.create(req);
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
	update: async function(req, res){
		try {
			const result = await model.updateMany({
				message: /auto/
			}, {
				$set: { message: "auto-modified" }
			});
			res.json({ message: "Les données ont été modifiées avec succès", modifiedCount: result.modifiedCount });
		} catch (err) {
			console.error('Erreur lors de la mise à jour de l\'élément dans la collection :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'élément dans la base de données.", error: err });
		}
	},
	// Comment supprimer des données de la base de données ?
	remove: async function(req, res){
		try {
			// Supprimer toutes les données avec le message spécifié
			const result = await model.deleteMany({ message: /auto/ });
			res.json({ message: "Les données ont été supprimées avec succès", deletedCount: result.deletedCount });
		} catch (err) {
			console.error('Erreur lors de la suppression de l\'élément dans la collection :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de l'élément dans la base de données.", error: err });
		}
	},
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
			const response = await axios.get('https://musicbrainz.org/ws/2/area?query=france&fmt=json');
			const data = response.data;
			res.json(data); // Renvoyer les données de l'API
		} catch (err) {
			console.error('Erreur lors de la récupération des données depuis l\'API externe :', err);
			res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des données depuis l'API externe.", error: err });
		}
	},
	// Affiche bonjour dans la console. Ne peut pas être appelé 2 fois en 30 secondes
	hello: async function(req,res){
		if( verrou ){
			res.json({ message: 'nop', demandeur: req });
			console.log('nop',req);
			return false;
		}
		verrou = true;
		await setTimeout( () => {
			verrou = false;
		}, 3000);
		console.log('HELLO HERE ',req);
		res.json({message: 'HELLO HERE ',req});
		return true;
	},
	// Lance une méthode à des moment aléatoire.
	aleat: async function(req,res){
		nbBoucle = nbBoucle + 1;
		res.json({message: "DEB : Une nouvelle boucle infini commance. id = "+nbBoucle});
		aleat(nbBoucle,10);
	},

	/*
	 * Récupére un objet de model avec son id.
	 * paramètre: l'id à chercher.
	 * retour null ou l'objet demandé.
	 */
	get: creater.get(model,"le test"),

	/*
	 * Récupére un objet de model avec son contenu.
	 * paramètre: le contenu à chercher.
	 * retour null ou l'objet demandé.
	 */
	getByName: getter,

	/*
	 * Ajouter un message à la base de donnée.
	 * paramètre: Le message à ajouter {message:String}.
	 * retour: L'id de l'objet contenant ce message.
	 */
	ajouter: creater.ajouter(model,getter,"message"),

	/*
	 * Le modéle de la table manipulé.
	 */
	model: model

}
