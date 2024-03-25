require('dotenv').config();

local = process.env.SERVER_LOCAL || false;
port = process.env.SERVER_PORT || 3080;

const hoteLocal = "localhost";
const adresseLocal = "http://" + hoteLocal;
const hoteDistant = "172.18.240.186";
const adresseWeb = "http://" + hoteDistant;

module.exports = {
	adresseLocal: adresseLocal,
	adresseWeb: adresseWeb,
	getAdresse: function(){
		if( local ){
			return adresseLocal;
		} else {
			return adresseWeb;
		}
	},
	getModePrincipal: function(){
		if( local ){
			return hoteLocal;
		} else {
			return hoteDistant;
		}
	},
	port: port
}
