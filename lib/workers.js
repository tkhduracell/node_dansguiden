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

	crontab.scheduleJob("* */6 * * *", job('parse'));
	crontab.scheduleJob("* */6 * * *", job('fetch'));

	setTimeout(function() {
		debug('Scheduling jobs ...');
		crontab.scheduleJob("* * */6 * *", job('parse'), null, null, false);
		crontab.scheduleJob("* * */6 * *", job('fetch'), null, null, false);
	}, 5000);

}

module.exports = init;
