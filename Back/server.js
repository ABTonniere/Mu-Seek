const express = require('express'); // Le controller de l'application
const cors = require('cors'); // Comment faire des requête HTTP

const app = express(); // Création de l'application
const PORT = 3080; // Port de communication

app.use(cors()); // Connection de l'application à internet

app.use(express.json()); // Type de donnée que le serveur envera () JSON

/*
 * À DESACTIVER EN MODE NORMALE *

// Les données que le serveur envera, afin de la test
app.get("/Events", (req,res) => {
	// Set de données de test.
	res.json({ message: "Welcome to Mu-Seek application." });
});

 * À DESACTIVER EN MODE NORMALE *
*/

/*
 * À DESACTIVER EN MODE TEST DU SERVEUR *
*/

// Connecter la base de donnée
const db = require("./app/index.js");
db.mongoose.connect(db.url, {
}).then(() => {
	console.log("Connecter à la base de donnée de Mu-Seek!");
}).catch(err => {
	console.error("Impossible de se connecter à la base de donnée de Mu-Seek!", err);
	process.exit();
});

// Rendre les événements de la base de donnée accessible
const eventRoutes = require('./app/routes/Events.routes');
app.use('/Events', eventRoutes);


/*
 * À DESACTIVER EN MODE TEST DU SERVEUR *
*/

// Mettre le serveur en attente d'une demande.
app.listen(PORT, () => {
	console.log('Server is running on PORT '+PORT);
	console.log('Watch result on :');
	console.log('    -> Local:   http://localhost:'+PORT+'/<ACCESS>');
	console.log('    -> Network: http://172.18.240.186:'+PORT+'/<ACCESS>');
	console.log('With <ACESS> in [Events]');
});
