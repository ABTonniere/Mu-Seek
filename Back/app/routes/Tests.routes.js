const {express, router, db} = require("./importStandard");
const controller = db.getViewCtrl('Tests');

// Route pour récupérer tous les utilisateurs
router.get('/hard', async (req, res) => {
	controller.findHard(req,res);
});
router.get('/mongodb', async (req, res) => {
	controller.findMongo(req,res);
});
router.get('/ecrire', async(req, res) => {
	controller.write(req,res);
});
router.get('/ecrireMongo', async(req, res) => {
	controller.write2({message: "Nouveau message générer automatiquement"},res);
});
router.get('/updatetoAuto', async(req, res) => {
	controller.update(req, res);
});
router.get('/removeAuto', async(req, res) => {
	controller.remove(req, res);
});
router.get('/gardeMessage', async(req, res) => {
	controller.transform(req, res);
});
router.get('/api', async(req, res) => {
	controller.fetchDataFromAPI(req, res);
});
const adress = "http://localhost:3080/tests/";
router.get('/', async (req, res) => {
	res.json({
		message: "Ceci est l'accés à quelques test de création d'API et à la gestion de mongoDB.",
		test:  [
			{
				nom: "index",
				adress: adress,
				comment: "Affiche cette liste"
			},
			{
				nom: "hard",
				adress: adress+"hard",
				comment: "Envoit de donnée coder en dur à l'application.",
				test: "L'envoit de donnée depuis le controller."
			},
			{
				nom: "find",
				adress: adress+"mongodb",
				comment: "Demande de donnée à la base de donnée.",
				test: "La récéption des données depuis la base de donnée."
			},
			{
				nom: "get",
				adress: adress+"ecrire?message=Mon%20super%20message",
				comment: "Récéption de donnée depuis l'application.",
				test: "La récéption des données d'un client."
			},
			{
				nom: "insert",
				adress: adress+"ecrireMongo",
				comment: "Ajoute des données à la base de données.",
				test: "La sauvegarde de donnée."
			},
			{
				nom: "update",
				adress: adress+"updatetoAuto",
				comment: "Transforme tout les 'Nouveau message' en 'Nouveau message généré automatiquement'.",
				test: "La modification de donnée."
			},
			{
				nom: "delete",
				adress: adress+"removeAuto",
				comment: "Supprime tout les 'Nouveau message généré automatiquement'.",
				test: "La supression de donnée."
			},
			{
				nom: "manipule JSON",
				adress: adress+"gardeMessage?message=azerty&inutile=ignorer&defaut=optionnel",
				comment: "Manipule un objet JSON en en créent un nouveau, en filtrant l'ancien, et avec des champs ayant une valeur par défault.",
				test: "La manipulation de donnée."
			},
			{
				nom: "API",
				adress: adress+"api",
				comment: "Fait une demande à l'API musicBrainz.",
				test: "La demande de donnée à l'API."
			}
		]
	});
});

module.exports = router;

