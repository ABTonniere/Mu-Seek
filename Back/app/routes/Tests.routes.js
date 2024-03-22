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
router.get('/gardeMessage', async(req, res) => {
	controller.transform(req, res);
});
router.get('/api', async(req, res) => {
	controller.fetchDataFromAPI(req, res);
});
router.get('/', async (req, res) => {
	res.json({message: "Ceci est l'accés à quelques test de création d'API et à la gestion de mongoDB."});
});

module.exports = router;

