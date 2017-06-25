const nedb = require('nedb');
const debug = require('debug')('db:init');

module.exports = {
	setup: function () {
		const db = new nedb({
			filename: 'dansguiden.db',
			autoload: true
		});
		db.ensureIndex({ fieldName: 'somefield' }, function (err) {
			// If there was an error, err is not null
			if(err) debug(err);
		});
		return db;
	}

};
