const db = require("../index.js");
const TestModel = db.getViewModel('Tests');

module.exports = {
	findHard: {
		message: "Vous avez obtenu la base de donnée (codé en dur) de l'API"
	}
}
