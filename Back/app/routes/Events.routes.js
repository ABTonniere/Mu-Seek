const {express, db} = require("./importStandard");
const controller = db.getCtrl('Events');

module.exports = (ADRESSE,VIEW) => { const ad = ADRESSE+VIEW; return {
	// Route pour récupérer tous les utilisateurs
	get: async(req, res) => {
		controller.getEvents(req.query,res);
	},
	search: async(req, res) => {
		const regex = new RegExp(req.query.req, 'i'); // 'i' pour effectuer une recherche insensible à la casse
		let obj = {};
		for( const table of ['Typeevents','Events','Areas'] ){
			const ctrl = db.getCtrl(table);
			const ret = await ctrl.search(regex).catch( err => {
				console.error("Recherche de "+regex+" dans la table "+table+" : ",err);
			});
			if( ret ){
				obj[table] = ret;
			}
		}
		res.json(obj);
	},
	filtre: async(req, res) => {
		controller.setFiltre(req.query,res);
	},

	none: async(req, res) => {
		res.json({
			message: "Accès aux événements. Liens que la web application doit utilisé.",
			adresses: {
				obtenire: {
					adresse: ad+"get?<PARAM>",
					comment: "Permet d'obtenire les événements.",
					PARAM: {
						deb: "La date de début de disponibilité de l'utilisateur. (renvoit les événements ce finissant après cette date)",
						fin: "La date de fin de disponibilité de l'utilisateur. (renvoit les événements ayant commencé avant cette date)",
						type: "La liste des types d'événements à obtenir. (liste de nom séparer par des '+')",
						latitude: "Renvoit tous les événements correspondant au filtre se trouvant sur cette latitude. (garde la même précision)",
						longitude: "Renvoit tous les événements correspondant au filtre se trouvant sur cette longitude. (garde la même précision)",
						id: "Obtient les événements ayant cette id."
					},
					exemple: ad+"get?latitude=45,longitude=56.245"
				},
				recherche: {
					adresse: ad+"search?<PARAM>",
					comment: "Permet d'obtenire une liste de terme ayant un rapport avec la recherche (nécéssite au moins trois lettres).",
					PARAM: {
						query: "La recherche en cours.",
						type: {
							comment: "Les types inclut dans la recherche (par défault : tous). Ils doivent-être séparer par des '+'.",
							liste: [
								"zone => Les grandes zones (ex: pays)",
								"place => Les adresses",
								"nom => Les événements",
								"type => Les événements"
							]
						}
					},
					exemple: ad+"search?query=fra&type=zone+place"
				},
				filtre: {
					adresse: ad+"filtre?<PARAM>",
					comment: "Permet de changer le filtre par défaut pour les prochaines requêtes get.",
					PARAM: {
						deb: "La date de début de disponibilité de l'utilisateur. (renvoit les événements ce finissant après cette date)",
						fin: "La date de fin de disponibilité de l'utilisateur. (renvoit les événements ayant commencé avant cette date)",
						type: "La liste des types d'événements à obtenir. (liste de nom séparer par des '+')",
						latitude: "Renvoit tous les événements correspondant au filtre se trouvant sur cette latitude. (garde la même précision)",
						longitude: "Renvoit tous les événements correspondant au filtre se trouvant sur cette longitude. (garde la même précision)",
						distMax: "La distance maximal des coordonnées de référence authorisé. À besoin d'au moins la latitude ou la longitude pour fonctionner."
					},
					exemple: ad+"filtre?latitude=45,longitude=56.245"
				}
			},
			retour: ADRESSE
		});
	}
} };
