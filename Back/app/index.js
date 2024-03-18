const dbConfig = require("./config/db.config.js"); // Importe la configuration de la base de donnée.

const mongoose = require("mongoose"); // Importe la base de donnée
//mongoose.Promise = global.Promise; // Permet les opérations Asynchrone

const db = {}; // Crée l'objet contenant la base de donnée.
db.mongoose = mongoose; // Indique le type de base de donnée
db.url = dbConfig.url; // Indique l'url d'accès à la base de donnée
db.events = require("./models/Events.model.js")(mongoose); // Charge la base de donnée

module.exports = db; // Exporte la base de donnée configuré et correctement chargé.

