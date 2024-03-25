const creater = require("./importStandard.js");
const db = require("../index.js");
const model = db.getModel('Areas');

const ctrlType = db.getCtrl('Typeareas');
const api = db.getCtrl("API");

const getter = creater.get(model,"la zone");
const ajouter = creater.ajouter(model, getter);
const areaSubscribe = creater.subscribe(model,'zonesContenu','zones');

module.exports = {
	/*
	 * Récupére un objet de model avec son id.
	 * paramètre: l'id à chercher.
	 * retour null ou l'objet demandé.
	 */
	get: getter,

	/*
	 * Ajoute un objet dans la table model.
	 * paramètre: l'objet à ajouter :
	 * > {nom:String, _id:String, type:String, categ:Area|Place}
	 * > {nom:String, _id:String, type:String, adresse:String, coordinates:{longitude:0,latitude:0}, categ:Area|Place}
	 * retour null ou l'id de l'objet.
	 */
	ajouter: async function(obj){
		let typeNom = obj.type;
		if(!( typeNom )){
			typeNom = obj.categ;
		}
		const type = await ctrlType.ajouter({nom:typeNom}).catch( err => {
			throw {
				message: "Impossible d'obtenir l'id du type de la zone à ajouter.",
				erreur: err,
				zone: obj
			};
		});
		if( (!type) || (!type.objet) || (!type.objet._id) ){
			throw {
				message: "Impossible de récupérer le type de la zone",
				retour: type,
				nomType: typeNom
			}
		}
		const typeId = type.objet._id;
		let adresse = null;
		if( obj.adresse ){
			adresse = obj.adresse;
		}
		let coord = null;
		if( obj.coordinates ){
			coord = obj.coordinates;
		} else {
			let demande = obj.nom;
			if( obj.adresse ){
				demande = obj.adresse;
			}
			coord = await api.geocodeur(demande).catch(err => {
				throw {
					message: "Impossible de récupérer les coordonnée de l'adresse demandé.",
					demande: demande,
					erreur: err
				}
			});
		}
		let area = {
			nom: obj.nom,
			_id: obj._id,
			adresse: adresse,
			coordinates: coord,
			typeareas_id: typeId,
			events: [],
			zonesContenu: [],
			zoneParente: null
		};
		const res = ajouter(area).catch( err => {
			throw {
				message: "Impossible d'obtenir la zone ajouter",
				erreur: err,
				zone: obj
			};
		});
		return res;
	},

	/*
	 * Inscrit une zone dans la zone.
	 * param idArea: L'id de la zone acceuillant.
	 * param idPlace: L'id de la zone s'inscrivant.
	 */
	areaSubscribe: async function(idParent,idArea){
		model.findById(idArea).then( async(obj) => {
			if( !obj ){
				throw new Error('Area '+idArea+' non trouvée');
			}
			if( obj.zoneParente ){
				throw new Error('Area '+idArea+' à déjà un parent : '+obj.zoneParente);
			}
			obj.zoneParente = idParent;
			const res = await areaSubscribe(idParent,idArea);
			const res2 = await obj.save();
			return { saveParent: res2, saveEnfant: res};
		}).catch(err => {
			throw {
				message: "Impossible pour l'invité de s'incrire.",
				inviter: {
					type: "Area",
					id: idArea
				},
				id: idParent,
				erreur: err
			};
		});
	},

	eventSubscribe:  creater.subscribe(model,'events','événements'),

	search: creater.search(model,'nom'),

	/*
	 * Le modéle de la table manipulé.
	 */
	model: model
};
