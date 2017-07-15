
const _ = require('lodash');
const jf = require('jsonfile');
const moment = require('moment');
const express = require('express');

const images = jf.readFileSync('public/images.json');

function init(app) {
	const router = express.Router();
	const db = app.locals.db;
	const jobs = app.locals.jobs;


	router.get('/', function (req, res) {

		db.versions.find({}, function (err, versions) {
			res.render('index', {
				images: images,
				versions: versions
			});
		});


	});

	router.get('/health', function (req, res) {
		res.send("OK");
	});

	router.get('/api/jobs', function (req, res) {
		res.send(_.keys(jobs));
	});

	router.get('/api/jobs/:job/trigger', function (req, res) {
		const j = req.param("job");
		jobs[j]({db: db});
		res.send("Update triggered");
	});

	router.get('/api/events', function (req, res) {
		// Find all documents in the collection
		var condition = {};

		if (req.query.to && req.query.from) {
			const to = moment(req.query.to).format('YYYY-MM-DD');
			const from = moment(req.query.from).format('YYYY-MM-DD');
			condition = { $and: [{ date: { $lte: to }}, { date: { $gte: from }}] }
		} else if (req.query.to && !req.query.from) {
			const to = moment(req.query.to).format('YYYY-MM-DD');
			condition = { date: { $lte: to }};
		} else if (!req.query.to && req.query.from) {
			const from = moment(req.query.from).format('YYYY-MM-DD');
			condition = { date: { $gte: from }};
		} else {
			// do nothing
		}

		const keys = ['country', 'region', 'city', 'band', 'weekday'];

		// Add to filter
		keys.forEach(function (key) {
			if (req.query[key]) {
				var obj = {};
				obj[key] = req.query[key];
				condition = _.merge(condition, obj);
			}
		});

		db.events.find(condition).exec(function (err, docs) {
			if (err) {
				console.log(err);
				return res.status(500).send('Sorry, an error occured');
			}
			res.json(docs);
		});
	});

	return router;
}
module.exports = init;
