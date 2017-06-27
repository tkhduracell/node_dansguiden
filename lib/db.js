const nedb = require('nedb');
const debug = require('debug')('app:db:init');

module.exports = {
	setup: function () {
		const db = new nedb({
			filename: './storage/dansguiden.db',
			autoload: true
		});
		debug("Creating index for database");
		db.ensureIndex({ fieldName: 'date' }, function (err) {
			// If there was an error, err is not null
			if(err) debug(err);
		});
		return db;
	}

};
