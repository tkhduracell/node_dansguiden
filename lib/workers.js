const _ = require('lodash');
const crontab = require('node-crontab');
const debug = require('debug')('app:jobs');

function init(app) {
	const opts = { db: app.locals.db };

	const job = function(name) {
		try {
			return function() {
				require('./jobs/' + name).run(opts);
			}
		} catch (err) {
			return function () {
				debug("Failed to create job " + name, err);
			};
		}
	};

	const jobs = ['parse', 'fetch'].map(function (j) {
		return [j, job(j)];
	});

	jobs.forEach(function (j) {
		crontab.scheduleJob("* */6 * * *", j[1]);
	});

	return _.fromPairs(jobs);
}

module.exports = init;
