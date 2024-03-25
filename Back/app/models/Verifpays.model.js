module.exports = mongoose => {
	return mongoose.model('verifpays',
		mongoose.Schema({
			nom: String,
			_id: String,
			derniereVerif: Date
		}).set('autoIndex', false)
	);
};
