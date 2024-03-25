const express = require('express'); // Le controller de l'application
const cors = require('cors'); // Comment faire des requête HTTP

const app = express(); // Création de l'application

const config = require('./app/config/server.config.js'); // Les configurations du server

app.use(cors()); // Connection de l'application à internet
app.use(express.json()); // Type de donnée que le serveur envera () JSON

// Connecter la base de donnée
const db = require("./app/index.js");
const devMode = db.config.devMode;
if( devMode ){
		console.log("Connection à la base de donnée de Mu-Seek..........DEV_MODE !");
} else {
	db.mongoose.connect(db.config.getDBAdress(), {
		/* DEPRECATED
		useNewUrlParser: true,
		useUnifiedTopology: true
		*/
	}).then(() => {
		console.log("Connection à la base de donnée de Mu-Seek..........RÉUSSIE !");
	}).catch(err => {
		console.error("Impossible de se connecter à la base de donnée de Mu-Seek!", err);
		process.exit();
	});
}

// Rendre les événements de la base de donnée accessible
lstRoutes = [];
const ADRESSE = config.getAdresse() + ':' + config.port + '/';
let tables = db.tables;
if( devMode ){
	tables = ["Events"];
}
for( const table of tables ){
	const adresse = ADRESSE + table + '/';
	console.log("Chargement des routes vers "+table+'.');
	const router = db.getRoutes(table)(ADRESSE,table+'/');
	for( const route of Object.keys(router) ){
		let nom = route;
		if( nom === "none" ){
			console.log("\t> Racine de la table.");
			nom = "";
		} else {
			console.log("\t> "+nom+".");
		}
		app.get("/"+table+"/"+nom, router[route]);
	}
	lstRoutes.push({
		Table: table,
		Adress: adresse,
		Comment: db.getDescr(table)
	});
}

app.get("/", (req,res) => {
	// Set de données de test.
	res.json({ message: "Bienvenu sur l'API de Mu-Seek, veuillez lire la doc pour savoir comment l'utiliser.", adresses: lstRoutes, retour: ADRESSE });
});

// Mettre le serveur en attente d'une demande.
const PORT = config.port;
app.listen(PORT, () => {
	console.log('Server is running on PORT: ',PORT);
	console.log('Watch result on :');
	console.log('    -> Local:   ', config.adresseLocal+':'+PORT );
	console.log('    -> Network: ', config.adresseWeb+':'+PORT );
	console.log('Privilegier : ', config.getModePrincipal() );
});
