module.exports = {
	url: "mongodb://localhost:27017/mu_seek_db",
	getUri: function(password) {
		return "mongodb+srv://erwanpechon:"+password+"@museekcluster.4lxcd5c.mongodb.net/mu_seek_db?retryWrites=true&w=majority&appName=MuSeekCluster"
	}
};
