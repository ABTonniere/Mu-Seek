module.exports = mongoose => {
	return mongoose.model('typeareas',
		mongoose.Schema({
			nom: String
		})
	);
};

