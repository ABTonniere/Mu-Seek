module.exports = mongoose => {
	const Tests = mongoose.model(
		"Tests",
		mongoose.Schema(
			{
				title: String,
				description: String,
				published: Boolean
			},
			{ timestamps: true }
		)
	);

	return Tests;
};
