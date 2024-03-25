const creater = require("./importStandard.js");
const db = require("../index.js");
const model = db.getModel('Typeevents');

const getter = creater.getBy(model,"le type d'événement","nom");

module.exports = {
	/*
	 * Récupére un objet de model avec son id.
	 * paramètre: l'id à chercher.
	 * retour null ou l'objet demandé.
	 */
	get: creater.get(model,"le type d'événement"),

	/*
	 * Récupére le premier objet ayant un certain message.
	 * paramètre: le terme à rechercher.
	 * retour null ou l'objet demandé.
	 */
	getByName: getter,

	/*
	 * Ajoute un objet dans la table model.
	 * paramètre: l'objet à ajouter : {name: String}
	 * retour null ou l'id de l'objet.
	 */
	ajouter: creater.ajouter(model, getter, "name"),

	/*
	 * Le modéle de la table manipulé.
	 */
	model: model
};
