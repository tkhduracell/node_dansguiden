const Nedb = require('nedb');
const debug = require('debug')('app:db:init');

const T6HRS = 1000 * 3600 * 6;

module.exports = {
	setup: function () {

		debug("Loading database");
		const db = {
			events: new Nedb({
				filename: './storage/dansguiden.db',
				autoload: true
			}),
			versions: new Nedb({
				filename: './storage/version.db',
				autoload: true
			})
		};

		debug("Creating index and persistence for databases");

		db.events.persistence.setAutocompactionInterval(T6HRS);
		db.events.ensureIndex({ fieldName: 'date' }, function (err) {
			// If there was an error, err is not null
			if(err) debug(err);
		});

		db.versions.persistence.setAutocompactionInterval(T6HRS);
		db.versions.ensureIndex({ fieldName: 'name', unique: true}, function(err) {
			// If there was an error, err is not null
			if (err) debug(err);
		});

		return db;
	}

};
