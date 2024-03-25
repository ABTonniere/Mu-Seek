const dbConfig = require("./config/db.config.js"); // Importe la configuration de la base de donnée.

const mongoose = require("mongoose"); // Importe la base de donnée
//mongoose.Promise = global.Promise; // Permet les opérations Asynchrone

const db = { // Crée l'objet contenant la base de donnée.
	tables: ['Tests','Verifpays','Events'], // La liste des vues utilisables pour la base de donnée
	mongoose: mongoose, // Le gestionnaire de base de donnée.
	config: dbConfig, // Obtient les configurations de la base de donnée.
	getModel: function(view) {
		return require('./models/'+view+'.model.js')(mongoose);
	},
	getCtrl: function(view) {
		return require('./controllers/'+view+'.controller.js');
	},
	getRoutes: function(view) {
		return require('./routes/'+view+'.routes.js');
	},
	getDescr: function(view) {
		return require('./descriptions/'+view+'.description.js');
	},
};

module.exports = db; // Exporte la base de donnée configuré et correctement chargé.

