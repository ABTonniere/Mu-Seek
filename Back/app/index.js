const dbConfig = require("./config/db.config.js"); // Importe la configuration de la base de donnée.

const mongoose = require("mongoose"); // Importe la base de donnée
//mongoose.Promise = global.Promise; // Permet les opérations Asynchrone

const db = { // Crée l'objet contenant la base de donnée.
	views: ['Tests'], // La liste des vues utilisables pour la base de donnée
	mongoose: mongoose, // Le gestionnaire de base de donnée.
	url: dbConfig.url, // L'URL de la base de donnée.
	getViewModel: function(view) {
		return require('./models/'+view+'.model.js')(mongoose);
	},
	getViewCtrl: function(view) {
		return require('./controllers/'+view+'.controller.js');
	},
	getViewRoutes: function(view) {
		return require('./routes/'+view+'.routes.js');
	},
};

module.exports = db; // Exporte la base de donnée configuré et correctement chargé.

