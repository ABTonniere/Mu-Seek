module.exports = mongoose => {
	return mongoose.model('tests',
		mongoose.Schema({
			message: String
		})
	);
};
