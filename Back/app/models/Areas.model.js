module.exports = mongoose => {
	return mongoose.model('areas',
		mongoose.Schema({
			nom: String,
			_id: String,
			adresse: String,
			coordinates: {
				longitude: Number,
				latitude: Number
			},
			typeareas_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'typeareas'
			},
			zoneParente: {
				type: String,
				ref: 'areas'
			},
			zonesContenu: [{
				type: String,
				ref: 'areas'
			}],
			events: [{
				type: String,
				ref: 'events'
			}],
		}).set('autoIndex', false)
	);
};
