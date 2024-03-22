const express = require('express'); // Le controller de l'application
const cors = require('cors'); // Comment faire des requête HTTP

const app = express(); // Création de l'application
const PORT = 3080; // Port de communication

app.use(cors()); // Connection de l'application à internet

app.use(express.json()); // Type de donnée que le serveur envera () JSON

// Connecter la base de donnée
const db = require("./app/index.js");
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

// Rendre les événements de la base de donnée accessible
app.get("/", (req,res) => {
	// Set de données de test.
	res.json({ message: "Bienvenu sur l'API de Mu-Seek, veuillez lire la doc pour savoir comment l'utiliser." });
});

for( const view of db.views ){
	console.log("Chargement de la vue "+view+'.');
	app.use('/'+view, db.getViewRoutes(view));
}

// Mettre le serveur en attente d'une demande.
app.listen(PORT, () => {
	console.log('Server is running on PORT '+PORT);
	console.log('Watch result on :');
	console.log('    -> Local:   http://localhost:'+PORT+'/<ACCESS>');
	console.log('    -> Network: http://172.18.240.186:'+PORT+'/<ACCESS>');
	console.log('With <ACESS> in [Events]');
});
