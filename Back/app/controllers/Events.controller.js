const fs = require('fs');

const creater = require("./importStandard.js");
const db = require("../index.js");
const model = db.getModel('Events');

const ctrlType = db.getCtrl('Typeevents');
const ctrlArea = db.getCtrl('Areas');

const getter = creater.get(model,"l'événement");
const ajouter = creater.ajouter(model, getter, "addEventsLock");

const distMaxBase = 10;
let systFiltre = {
	distMax: distMaxBase
};

let eventsForDevMode = null;
fs.readFile('./app/devMode.ressource.json',(err,file) => {
	if (err) {
		console.error('Une erreur s\'est produite lors de la lecture du fichier :', err);
		return;
	}
	try {
		eventsForDevMode = JSON.parse(file);
		console.log("Le fichier du devMode à était chargé.");
	} catch (error) {
		console.error('Une erreur s\'est produite lors de la conversion du JSON :', error);
	}
});

const getCritere = function(req,field,func){
	let crit = systFiltre[field];
	if( req[field] ){
		crit = req[field];
	}
	if( crit ){
		console.log("Critere "+field+" : ",crit);
		return func(crit);
	}
}
let devMode = db.config.devMode;

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
	 * > {nom:String, _id:String, type:String, lifeSpan:{begin:Date,end:Date,ended:Number}, areaId:String, verifpays:String, urls:[{type:String,nom:String,url:String}]}
	 * retour null ou l'id de l'objet.
	 */
	ajouter: async function(obj){
		let typeNom = obj.type;
		if(!( typeNom )){
			typeNom = "Other";
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
		let evenement = {
			nom: obj.nom,
			_id: obj._id,
			typeevents_id: typeId,
			lifeSpan: obj.lifeSpan,
			area_id: obj.areaId,
			verifpays_id: obj.verifpaysId,
			urls: obj.urls,
		};
		return ajouter(evenement);
	},

	getEvents: async function(req, res){
		// Préparer la recherche des événements
		let criteres = {};
		if( req.id ){
			criteres = {_id: req.id};
		} else {
			let types = [];
			getCritere(req,"type", (critere) => {
				types = critere.split(' ');
			});
			if( types && (types.length>0) ){
				let typeIds = [];
				for( const type of types ){
					try{
						const objT = await ctrlType.getByName({nom: type});
						if( objT && objT._id ){
							typeIds.push(objT._id);
						}
					} catch (err) {
						console.log("Une erreur c'est produite lors de la récupération du type "+type,err);
					}
				}
				criteres["typeevents_id"] = { $in : typeIds };
			}
			getCritere(req,"deb", (critere) => {
				criteres["lifeSpan.end"] = { $gt: critere };
			});
			getCritere(req,"fin", (critere) => {
				criteres["lifeSpan.begin"] = { $lt: critere };
			});
		}
		// Obtenire les événements
		let events = null;
		console.log("criteres : ",criteres);
		try{
			//Event.find(criteres).populate('typeevents_id').populate('area_id').populate('typeareas_id').exec( (err,es) => {
			if( devMode ){
				events = eventsForDevMode;
			} else {
				events = await model.find(criteres)
					.populate('typeevents_id', 'nom')
					.populate('area_id')
					.populate({
						path: 'area_id',
						select: ['nom','adresse','coordinates'],
						populate: { path: 'typeareas_id', select: 'nom' }
					})
					.exec();
			}
		} catch (err) {
			res.status(500).json({
				message: "Impossible d'obtenire les événements",
				erreur: err,
				criteres: criteres
			});
			return;
		}
		console.log(events[0]);
		// Obtenir les coordonnées de la limite
		let lat = null;
		getCritere(req,"lat", (critere) => {
			lat = critere;
		});
		let lon = null;
		getCritere(req,"lon", (critere) => {
			lon = critere;
		});
		let distMax = null;
		getCritere(req,"distMax", (critere) => {
			distMax = critere;
		});
		// Filtrer les événements seulons leurs coordonnées
		const filteredEvents = events.filter( e => {
			// Obtenir les coordonnées de l'événements
			const coord = e.area_id ? e.area_id.coordinates : { longitude: 0, latitude: 0 };
			// Filtrer (true=>garde | false=>supprimer)
			if(!( distMax )){
				return true;
			}
			if(!( lat )){
				if(!( lon )){
					return true;
				}
				const distance = Math.abs(coord.longitude - lon) * 111;
				return distance < distMax;
			} else {
				if(!( lon )){
					const distance = Math.abs(coord.latitude - lat) * 111;
					return distance < distMax;
				}
				// Conversion en radian
				const lat1Rad = lat * (Math.PI / 180);
				const lat2Rad = coord.latitude * (Math.PI / 180);
				const lon1Rad = lon * (Math.PI / 180);
				const lon2Rad = coord.longitude * (Math.PI / 180);
				// Calcule des distances
				const dLat = lat2Rad - lat1Rad;
				const dLon = lon2Rad - lon1Rad;
				// Croisement des informations
				const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.cos(lat1Rad) * Math.cos(lat2Rad) *
					Math.sin(dLon/2) * Math.sin(dLon/2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				const d = 6371 * c;
				console.log("dist = ",d,d<distMax);
				return d < distMax;
			}
			return true;
		});
		// Formaté les événements
		let formatedEvents = null;
		if( devMode ){
			formatedEvents = filteredEvents;
		} else {
			formatedEvents = filteredEvents.map(item => {
				return {
					nom: item.nom,
					_id: item._id,
					typeevents: item.typeevents_id ? item.typeevents_id.nom : "Unknown",
					lifeSpan: {
						begin: item.lifeSpan.begin,
						end: item.lifeSpan.end,
						ended: item.lifeSpan.ended
					},
					area: {
						nom: item.area_id ? item.area_id.nom : "Unknown",
						adresse: item.area_id ? item.area_id.adresse : "Unknown",
						coordinates: item.area_id ? item.area_id.coordinates : { longitude: 0, latitude: 0 },
						typeareas: item.area_id && item.area_id.typeareas_id ? item.area_id.typeareas_id.nom : "Unknown"
					},
					urls: item.urls
				};
			});
		}
		// Renvoyé les événements
		res.json(formatedEvents);
	},

	setFiltre: async function(req,res){
		if( req.type ){
			if( req.type instanceof Array ){
				systFiltre["type"] = req.type;
			} else {
				delete systFiltre["type"];
			}
		}
		if( req.distMax ){
			if( req.distMax === "del" ){
				systFiltre["distMax"] = distMaxBase;
			} else {
				systFiltre["distMax"] = req.distMax;
			}
		}
		if( req.deb ){
			if( req.deb === "del" ){
				delete systFiltre["deb"];
			} else {
				systFiltre["deb"] = req.deb;
			}
		}
		if( req.fin ){
			if( req.fin === "del" ){
				delete systFiltre["fin"];
			} else {
				systFiltre["fin"] = req.fin;
			}
		}
		if( req.lat ){
			if( req.lat === "del" ){
				delete systFiltre["lat"];
			} else {
				systFiltre["lat"] = req.lat;
			}
		}
		if( req.lon ){
			if( req.lon === "del" ){
				delete systFiltre["lon"];
			} else {
				systFiltre["lon"] = req.lon;
			}
		}
		res.json(systFiltre);
	},

	search: creater.search(model,'nom'),

	/*
	 * Le modéle de la table manipulé.
	 */
	model: model
};
