module.exports = mongoose => {
	const Events = mongoose.model(
		"Events",
		mongoose.Schema(
			{
				title: String,
				description: String,
				published: Boolean
			},
			{ timestamps: true }
		)
	);

	return Events;
};
