const creater = require("./importStandard.js");
const API = require("./API.controller.js");
const db = require("../index.js");
const model = db.getModel('Verifpays');

const ctrlArea = db.getCtrl('Areas');
const ctrlEvent = db.getCtrl('Events');

const getter = creater.get(model,"Le pays groupant les événements");
const limit = 50;
const demandeEvent = "&inc=place-rels+area-rels+label-rels+url-rels&limit="+limit+"&offset=";
let noDebug=true;
async function parseEvent(idPays, data=null){
	let offset = 1600;
	let recursive = true;
	if( data ){
		offset = data["event-offset"];
		recursive = (data["event-count"] > offset) && noDebug;
		offset = offset + limit;
		console.log("=========================\n=== mise à jour des événements du pays "+idPays+" : Ligne "+offset+"/"+data["event-count"]+" ===\n=====================\n");
	}
	if( recursive ){ // Fetch la page suivante
		API.musicBrainz({
			query: "event?area=" + idPays + demandeEvent + offset,
			method: (response) => {
				parseEvent(idPays, response);
				return "OK";
			}
		},true).then( response => {
		}).catch(err => {
			console.error({
				message: "Impossible de récupérer les événements du pays "+idPays,
				erreur: err
			});
		});
	} else { // Mettre à jour la date de dernière vérification
		console.log("=========================\n=== FIN de la mise à jour des événements du pays "+idPays+" ===\n=====================\n");
	}
	if( data ){
		data.events.map( async(item) => {
			try {
				urlInfo = [];
				let idArea = null;
				let idPlace = null;
				for( const rel of item.relations ){
					if( rel.ended === "true" ){
						continue;
					}
					switch(rel['target-type']){
						case "place" :
							const relArea = rel.place.area;
							// {nom:String, _id:String, type:String}
							const objA = await ctrlArea.ajouter({
								nom: relArea.name,
								_id: relArea.id,
								type: relArea.type,
								categ: "Area"
							}).catch(err => {
								throw {
									message: "impossible d'ajouter le pere de la zone.",
									erreur: err
								}
							});
							idArea = objA.objet._id;
							if(!( idArea )){
								throw {
									message: "Impossible de créer la zone parente du lieu.",
									obj: relArea
								};
							}
							// {nom:String, _id:String, type:String, adresse:String, coordinates:{longitude:0,latitude:0}}
							const objetP = await ctrlArea.ajouter({
								nom: rel.place.name,
								_id: rel.place.id,
								type: rel.place.type,
								adresse: rel.place.address,
								coordinates: rel.place.coordinates,
								categ: "Place"
							}).catch(err => {
								throw {
									message: "impossible d'ajouter la zone.",
									erreur: err
								}
							});
							idPlace = objetP.objet._id;
							if(!( idPlace )){
								throw {
									message: "Impossible de créer le lieu.",
									obj: rel
								};
							}
							if( objetP.creer ){
								await ctrlArea.areaSubscribe(idArea,idPlace);
							}
							idArea = null;
							break;
						case "area" :
							// {nom:String, _id:String, type:String}
							const objAA = await ctrlArea.ajouter({
								nom: rel.area.name,
								_id: rel.area.id,
								type: rel.area.type,
								categ: "Area"
							}).catch(err => {
								throw {
									message: "impossible d'ajouter la zone.",
									erreur: err
								}
							});
							idArea = objAA.objet._id;
							if(!( idArea )){
								throw {
									message: "Impossible de créer la zone.",
									obj: rel
								};
							}
							if( idPlace ){
								idArea = null;
							}
							break;
						case "url" :
							let type = "Other";
							const typeDB = ["bandsintown","last.fm","setlistfm","songkick","vgmdb","wikidata","wikipedia"];
							if( typeDB.includes(rel.type) ){
								type = "db";
							} else if( rel.type === "youtube" ) {
								type = "video";
							} else if( rel.type === "crowdfunding" || rel.type === "patronage" || rel.type === "ticketing" ){
								type = "money";
							}
							urlInfo.push({
								type: type,
								nom: rel.type,
								url: rel.url.resource
							});
							break;
						default :
							console.warn({
								message: "Relation de type inconnue.",
								rel: rel,
								idEvent: item.id
							});
					}
				}
				let idEvent = null;
				if( item.cancelled === false ){
					const objE = await ctrlEvent.ajouter({
						_id: item.id,
						lifeSpan: item["life-span"],
						nom: item.name,
						areaId: idPlace ? idPlace : idArea,
						verifpaysId: idPays,
						urls: urlInfo,
						type: item.type
					}).catch(err => {
						throw {
							message: "impossible d'ajouter l'événement.",
							erreur: err
						}
					});
					idEvent = objE.objet._id;
					if(!( idEvent )){
						throw {
							message: "Impossible de créer l'événement.",
							obj: item
						};
					}
					if( idPlace ){
						await ctrlArea.eventSubscribe(idPlace,idEvent);
					} else if( idArea ){
						await ctrlArea.eventSubscribe(idArea,idEvent);
					}
				}
			} catch (err) {
				console.log("Un événement n'à pas put être ajouter.",err);
			}
		});
	}
}
const ajouter = async function(objet){
	const pays = await creater.ajouter(model, getter)({nom: objet.name,_id: objet.id,derniereVerif: new Date(0)});
	if( pays && pays.objet._id ){
		console.log("=========================\n=== DEBUT de la mise à jour des événements du pays "+pays.objet._id+" ===\n=====================\n");
		parseEvent(pays.objet._id).catch(err => {
			console.log("Une erreur est arrivé durant l'ajout des événements du pays "+pays.objet.nom+'('+pays.objet._id+')'+" :\n", err);
		});
	}
	return pays;
};


module.exports = {
	/*
	 * Recherche un pays dans la base de donnée de musicBrainz.
	 * Renvoit la réponse de la db dans res.
	 */
	recuperePaysDeAPI: async function(req,res){
		const query = req.query;
		const nomPays = query.nom;
		API.musicBrainz({
			query: "area?query="+nomPays+"%20AND%20type:Country",
			method: (data) => {
				const pays = data.areas[0];
				ajouter(pays);
				return "OK";
			}
		},true).then( response => {
			res.json({message:"Le pays à était ajouté à la liste des pays à vérifier."});
		}).catch(err => {
			res.json({message: "Impossible de récupérer les donnée demandé.", demande: query, erreur:err});
		});
	},

	/*
	 * Ajoute un pays dans la base de donnée.
	 * Renvoit la réponse de la db dans res.
	 */
	ajouterPays: async function(req,res){
		const data = req.query;
		const result = ajouter({name: data.nom, id:data.id});
		res.json({
			message: "Ajout d'un nouveau pays à vérifier.",
			res: result
		});
	},

	/*
	 * Récupére un objet de model avec son id.
	 * paramètre: l'id à chercher.
	 * retour null ou l'objet demandé.
	 */
	get: getter,

	/*
	 * Recherche le premier pays ayant besoin de mise à jour.
	 * renvoit le pays.
	 */
	getOldPays: async function(){
		try {
			// Effectuer une requête pour trouver le pays avec la date la plus ancienne
			const paysPlusAncien = await model.findOne({}, {}, { sort: { date: 1 } });

			// Renvoyer le résultat
			return paysPlusAncien;
		} catch (error) {
			return null;
		}
	},

	/*
	 * Ajoute un objet dans la table model.
	 * paramètre: l'objet à ajouter : {nom:String, _id:String}.
	 * retour null ou l'id de l'objet.
	 */
	ajouter: ajouter
};
