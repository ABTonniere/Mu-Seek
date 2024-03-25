const {express, db} = require("./importStandard");
const controller = db.getCtrl('Verifpays');

module.exports = (ADRESSE,VIEW) => { const ad = ADRESSE+VIEW; return {
	// Route pour récupérer tous les utilisateurs
	chercherPays: controller.recuperePaysDeAPI,
	ajouterPays: controller.ajouterPays,

	none: async(req,res) => {
		res.json({
			message: "Ajouter des pays à surveiller. Seuls les événements de ses pays seront ajouté.",
			adresses: {
				auto: {
					adress: ad+"chercherPays",
					comment: "Ajoute un pays à la abse de donnée. Ce pays servira à cherché des événements. Le pays sera obtenu de la base de donnée MusicBrainz.",
					param: "?nom=<NOMPAYS>",
					exemple: ad+"chercherPays?nom=france"
				},
				manu: {
					adress: ad+"ajouterPays",
					comment: "Ajoute un pays à la abse de donnée. Ce pays servira à cherché des événements. L'id doit-être celui que MusicBrainz utilise pour ce pays.",
					param: "?nom=<NOMPAYS>&id=<MBDID",
					exemple: ad+"ajouterPays?nom=France&id=08310658-51eb-3801-80de-5a0739207115"
				}
			},
			retour: ADRESSE
		});
	}
} };
