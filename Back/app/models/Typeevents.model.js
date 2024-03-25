module.exports = mongoose => {
	return mongoose.model('typeevents',
		mongoose.Schema({
			nom: String
		})
	);
};


