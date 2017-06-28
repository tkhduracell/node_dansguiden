
const jf = require('jsonfile');
const scraperjs = require('scraperjs');
const debug = require('debug')('app:jobs:playstore');
const moment = require('moment');

function run() {
	console.log('Running Google Play parse... ' + moment().toString() );
	scraperjs.StaticScraper.create('https://play.google.com/store/apps/details?id=feality.dans')
		.scrape(function($) {
			return $(".whatsnew .recent-change")
				.map(function() {
					return $(this).text();
				})
				.get();
		}, function(items) {
			try {
				var vs = [];

				items.forEach(function (txt, idx) {
					if (txt.match(/\W*v\W*[0-9](\.[0-9]+)*/i)) {
						vs.push({name: "Uppdatering " + txt.trim(), lines: []});
					} else if (vs.length > 0) {
						vs.slice(-1)[0].lines.push(txt.replace(/\W*\*\W*/i, ''));
					}
				});

			} catch (err) {
				debug("Failed to read version info", err);
			}

			jf.writeFile('public/versions.json', vs, function(err) {
				debug("Faield to write versions", err);
			});

			debug('Running Google Play parse... Done');
		});
}

module.exports = {
	run: run
};
