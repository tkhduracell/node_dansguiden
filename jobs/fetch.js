const jf = require('jsonfile');
const debug = require('debug')('app:jobs');
const cheerio = require('cheerio');
const request = require('request');
const moment = require('moment');

const url = 'http://www.danslogen.se/dansprogram';

function log(msg) {
	console.log(msg);
}
function now() {
	return new Date().toString();
}

const months = {
	"januari": 1,
	"februari": 2,
	"mars": 3,
	"april": 4,
	"maj": 5,
	"juni": 6,
	"juli": 7,
	"augusti": 8,
	"september": 9,
	"oktober": 10,
	"november": 11,
	"december": 12
};

const cols = [
	'weekday', 'date', 'time', 'band', 'place', 'city', 'region', 'country'
];

function run() {

	log('Running Dansguiden load... ' + now() );
	request(url, function (err, resp, body) {
		if (err) {
			return console.log('error:', err); // Print the error if one occurred
		}
		const baseUrl = resp.request.href.replace(resp.request.path, "");
		read(body, baseUrl);
	});


	function read(body, baseUrl) {
		log('Running Dansguiden parse... ' + now() );
		const $ = cheerio.load(body);

		return list($, baseUrl)
			.forEach(function (obj) {
				loadPage(obj, function (events) {
					log(events);

				});

			});


	}

	function loadPage(obj, callback) {
		const url = obj.link;

		log('Running Dansguiden parse or page ' + obj.year + " " + obj.month );
		request(url, function (err, resp, body) {
			if (err) {
				return console.log('error:', err); // Print the error if one occurred
			}

			readPage(body, obj.month, obj.year, callback);
		});
	}

	function readPage(body, month, year, callback) {
		const $ = cheerio.load(body);

		$("tr")
			.get()
			.filter(function (itm) {
				return $(itm).children("td").length === 9 ||
					$(itm).children("td[colspan=9]").first()
				;
			})
			.filter(function (itm) {
				return $(itm).children().get().some(function (itm) {
					return itm.name !== "th";
				});
			})
			.map(function (itm) {
				if ($(itm).children("td").first().attr("colspan") === "9") {
					const arr = $(itm).text().split(/\W+/i).filter(function (s) {
						return s.trim().length > 0;
					});
					return {type: 'header', date: arr};
				} else if ($(itm).children("td").length === 9) {
					const arr = $(itm).children("td").get().map(function (td) {
						return $(td).text();
					});
					return {type: 'event', data: arr};
				} else {
					return {type: 'unknown', data: $(itm).html()};
				}
			})
			.map(function (itm) {
				if (itm.type === 'event') {
					const kv = zip(cols, itm.data).reduce(function (prev, itm) {
						prev[itm[0]] = itm[1];
						return prev;
					}, {});
					return {type: itm.type, data: kv};
				}
				return itm;
			})
			.map(function (itm) {
				if (itm.type === 'event') {
					itm.data.date = moment({
						date: parseInt(itm.data.date),
						month: month - 1,
						year: year
					});
				}
				return itm;
			})
			.map(function (itm) {
				log(itm);
			})

	}

	function list($, baseUrl) {
		return $("a[title]")
		.map(function (idx, itm) {
			return {link: $(itm).attr("href"), title: $(itm).attr('title')};
		})
		.get()
		.filter(function (obj) {
			return obj.title.startsWith("Visa danser i ");
		})
		.map(function (obj) {
			return {link: obj.link, date: obj.title.replace(/Visa danser i /i, '')};
		})
		.map(function (obj) {
			const split = obj.date.split(/\W+/i);
			return {link: obj.link, month: split[0], year: split[1]};
		})
		.map(function (obj) {
			return {link: baseUrl + obj.link, month: months[obj.month], year: parseInt(obj.year)};
		})
	}

}

function zip(a, b) {
	return a.map(function (e, i) {
		return [e, b[i]];
	});
}

run();
