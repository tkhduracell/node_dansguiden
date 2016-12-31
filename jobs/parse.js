
var jf = require('jsonfile')
var scraperjs = require('scraperjs');
var debug = require('debug')('app:jobs');

var me = module.exports;

me.run = function () {
	console.log('Running Google Play parse... ' + new Date().toString() );
	scraperjs.StaticScraper.create('https://play.google.com/store/apps/details?id=feality.dans')
		.scrape(function($) {
			return $(".whatsnew .recent-change")
				.map(function() {
					return $(this).text();
				})
				.get();
		}, function(items) {
			var vs = [];

			items.forEach(function (txt, idx) {
				if (txt.match(/\W*v\W*[0-9](\.[0-9]+)*/i)) {
					vs.push({name: "Uppdatering " + txt.trim(), lines: []});
				} else {
					vs.slice(-1)[0].lines.push(txt.replace(/\W*\*\W*/i, ''));
				}
			});

			jf.writeFile('public/versions.json', vs, function(err) {
				debug(err);
			});

			debug('Running Google Play parse... Done');
		});
};
