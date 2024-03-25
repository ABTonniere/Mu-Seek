const axios = require('axios');

let musicBrainzLock = false;
let musicBrainzDemandes = [];

/*
 * Tire un entier au hasard :
 * min = l'entier minimum
 * max = l'entier maximum
 * return l'entier tirer.
 */
const aleat = function(min,max){
	Math.floor(Math.random() * max-min) + min;
};

/*
 * Ajoute une demande à la file des demandes pour l'API musicBrainz.
 */
const musicBrainzAjouteDemande = function(demande){
	musicBrainzDemandes.push(demande);
}

/*
 * Essai de faire une demande à l'API.
 * demande : La demande à faire. {api:String, method:func(RES)>notNull}
 * assurer : Si true, sauvegardera la demande et réessairera plus tard.
 * return : le retour de la methode donnée dans la demande ou null.
 * ATTENTION, dans le cas d'une sauvegarde, le retour de la method sera perdu.
 * ATTENTION, dans le cas d'une sauvegarde, la demande ne sera supprimé que si il y à un retour de method.
 */
const musicBrainz = async function(demande, assurer=false){
	// Tester si l'on peut faire une demande
	if( musicBrainzLock ){
		if( assurer ){
			musicBrainzAjouteDemande(demande);
		}
		return null;
	}
	// Vérouiller les appel à l'API.
	musicBrainzLock = true;
	setTimeout( () => {
		musicBrainzLock = false;
	}, 2000 * aleat(1,20) );
	// Envoyé la demande à l'API
	const query = 'https://musicbrainz.org/ws/2/' + demande.query + "&fmt=json";
	try {
		const response = await axios.get(query);
		if( response && response.data ){
			const data = response.data;
			return await demande.method(data);
		} else {
			throw { ERREUR: "Une réponse inatendu est arrivé.", response: response};
		}
	} catch (err) {
		const error = {
			message: "Une erreur s'est produite lors de la récupération des données depuis l'API externe.",
			error: err,
			requete: query
		};
		console.error(error);
		throw error;
	}
	return null;
};

//let serverRunning = true;
async function musicBrainzRoutine(){
	//if (!serverRunning) return;
	let delai = aleat(1,3);
	if( musicBrainzDemandes.length === 0 ){
		delai = 3;
	} else {
		let ret = null;
		ret = await musicBrainz( musicBrainzDemandes[0] ).catch( err => {
			ret = null;
			console.log("musicBrainzRoutine:musicBrainz", err);
		});
		if( ret ){
			musicBrainzDemandes.shift();
		}
	}
	setTimeout( () => {
		musicBrainzRoutine().catch(err => {console.log("musicBrainzRoutine", err)});
	}, delai * 1000);
}
musicBrainzRoutine().catch(err => {console.log("musicBrainzRoutine", err)});

const geocodeurHTTP = 'https://nominatim.openstreetmap.org/search?format=json&q='
const geocodeurCacheLim = 10;
let geocodeurCache = [];
async function geocodeur(req) {
	if( geocodeurCache.hasOwnProperty(req) ){
		return geocodeurCache[req];
	}
	const query = geocodeurHTTP + encodeURIComponent(req);
	/*
	try{
		const response = await axios.get(query);
		if( response && response.data && (response.data.length>0) ){
			const lieu = response.data[0]; // Prend la première correspondance
			const lat = parseFloat(lieu.lat);
			const lon = parseFloat(lieu.lon);
			const result = {latitude: lat, longitude: lon};
			geocodeurCache[req] = result;
			// Nettoyer le cache
			const cacheKeys = Object.keys(geocodeurCache);
			if (cacheKeys.length > geocodeurCacheLim) {
				delete geocodeurCache[cacheKeys[0]];
			}
			// Envoyé le résultat
			return result;
		} else {
			throw {
				message: "Le retour ne contient pas de données.",
				response: response
			}
		}
	} catch (err) {
		console.error(err);
		throw {
			message: "Erreur geocodeur.",
			lieu: req,
			demande: query,
			erreur: err
		}
	}
	*/
	return {longitude: 0, latitude: 0};
}

module.exports = {
	aleat: aleat,
	musicBrainz: musicBrainz,
	musicBrainzAjouteDemande: musicBrainzAjouteDemande,
	geocodeur: geocodeur
};
