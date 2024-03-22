module.exports = mongoose => {
	const Tests = mongoose.model(
		'tests',
		mongoose.Schema({
			message: String
		})
	);

	return Tests;
};
