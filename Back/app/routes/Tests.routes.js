const {express, db} = require("./importStandard");
const controller = db.getCtrl('Tests');

module.exports = (ADRESSE,VIEW) => { const ad = ADRESSE+VIEW; return {
	// Route pour récupérer tous les utilisateurs
	hard: controller.findHard,
	mongodb: controller.findMongo,
	ecrire: controller.write,
	updatetoAuto: controller.update,
	removeAuto: controller.remove,
	gardeMessage: controller.transform,
	api: controller.fetchDataFromAPI,
	aleat: controller.aleat,

	ecrireMongo: async(req, res) => {
		controller.write2({message: "Nouveau message générer automatiquement"},res);
	},
	hello: async(req, res) => {
		controller.hello("user",res);
	},
	getById: async(req, res) => {
		const input = req.query;
		res.json({res: await controller.get(input.id)});
	},
	getByContenu: async(req, res) => {
		const input = req.query;
		res.json({res: await controller.getByName(input.message)});
	},
	ajouter: async(req, res) => {
		const input = req.query;
		res.json({res: await controller.ajouter({message: input.message})});
	},

	none: async (req, res) => {
		res.json({
			message: "Ceci est l'accés à quelques test de création d'API et à la gestion de mongoDB.",
			adresses: {
				index: {
					adress: ad,
					comment: "Affiche cette liste"
				},
				hard: {
					adress: ad+"hard",
					comment: "Envoit de donnée coder en dur à l'application.",
					test: "L'envoit de donnée depuis le controller."
				},
				find: {
					adress: ad+"mongodb",
					comment: "Demande de donnée à la base de donnée.",
					test: "La récéption des données depuis la base de donnée."
				},
				get: {
					adress: ad+"ecrire?message=Mon%20super%20message",
					comment: "Récéption de donnée depuis l'application.",
					test: "La récéption des données d'un client."
				},
				insert: {
					adress: ad+"ecrireMongo",
					comment: "Ajoute des données à la base de données.",
					test: "La sauvegarde de donnée."
				},
				update: {
					adress: ad+"updatetoAuto",
					comment: "Transforme tout les 'Nouveau message' en 'Nouveau message généré automatiquement'.",
					test: "La modification de donnée."
				},
				deleted: {
					adress: ad+"removeAuto",
					comment: "Supprime tout les 'Nouveau message généré automatiquement'.",
					test: "La supression de donnée."
				},
				json: {
					adress: ad+"gardeMessage?message=azerty&inutile=ignorer&defaut=optionnel",
					comment: "Manipule un objet JSON en en créent un nouveau, en filtrant l'ancien, et avec des champs ayant une valeur par défault.",
					test: "La manipulation de donnée."
				},
				api: {
					adress: ad+"api",
					comment: "Fait une demande à l'API musicBrainz.",
					test: "La demande de donnée à l'API."
				},
				hello: {
					adress: ad+"hello",
					comment: "Dit bonjour et s'auto-block pendant 30 secondes.",
					test: "Limiter le nombre de requête sur un temps donnée."
				},
				createGet: {
					adress: ad+"getById?id=65ffe1de2946854469c00e7f",
					comment: "Obtenir un objet en utilisant son ID.",
					test: "La création d'une fonction par le creater."
				},
				createGetBy: {
					adress: ad+"getByContenu?message=Trouver",
					comment: "Obtenir un objet en utilisant son contenu.",
					test: "La création d'une fonction par le creater."
				},
				createAdd: {
					adress: ad+"ajouter?message=Mon%20message%20non%20auto",
					comment: "Ajouter un message, sans doublon.",
					test: "La création d'une fonction par le creater."
				},
				aleat: {
					adress: ad+"aleat",
					comment: "Se relance à des intervalle aléatoire.",
					test: "Le lancement de fonction à des périodes aléatoire."
				}
			},
			retour: ADRESSE
		});
	},
} };

