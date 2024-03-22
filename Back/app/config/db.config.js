require('dotenv').config();

user = process.env.DB_USER || "";
password = process.env.DB_PASSWORD || "";
mode =  process.env.DB_DIST || "";

module.exports = {
	getDBAdress: function(){
		if( mode == "" || mode == "false" ){
			return "mongodb://127.0.0.1:27017/mu_seek_db";
		} else {
			return "mongodb+srv://"+user+":"+password+"@museekcluster.4lxcd5c.mongodb.net/mu_seek_db?retryWrites=true&w=majority&appName=MuSeekCluster";
		}
	}
};
