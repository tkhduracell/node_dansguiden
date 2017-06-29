
const scraperjs = require('scraperjs');
const debug = require('debug')('app:jobs:playstore');

const url = 'https://play.google.com/store/apps/details?id=feality.dans';

function extractContent($) {
	return {
		lines: $(".whatsnew .recent-change")
			.map(function () {
				return $(this).text()
					.replace(/^\W*\*\W*/, '');
			})
			.get(),
		name: $("div[itemProp='softwareVersion']")
			.map(function () {
				return $(this).text()
					.trim();
			})
			.get()
			.join(", "),
		date: $("div[itemProp='datePublished']")
			.map(function () {
				return $(this).text()
					.trim();
			})
			.get()
			.join(", ")
	}
}

function run(opts, cb) {
	cb = cb || function () {};

	const db = opts.db.versions;

	debug('Running Google Play parse... ');

	function saveToDb(data) {
		db.update({name: data.name}, data, {upsert: true}, function (err, numReplaced) {
			if (err) return debug(err);
			debug("Updated version " + data.name + " with " + JSON.stringify(data.lines));
			cb(data);
		});
	}

	scraperjs.StaticScraper
		.create(url)
		.scrape(extractContent, saveToDb);
}

module.exports = {
	run: run
};
