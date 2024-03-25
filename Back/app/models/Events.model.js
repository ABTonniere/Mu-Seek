module.exports = mongoose => {
	return mongoose.model('events',
		mongoose.Schema({
			nom: String,
			_id: String,
			typeevents_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'typeevents'
			},
			lifeSpan: {
				begin: Date,
				end: Date,
				ended: Number
			},
			area_id: {
				type: String,
				ref: 'areas'
			},
			verifpays_id: {
				type: String,
				ref: 'verifpays'
			},
			urls: [{
				type: {
					type: String,
					default: "Other"
				},
				nom: String,
				url: String
			}]
		}).set('autoIndex', false)
	);
};
