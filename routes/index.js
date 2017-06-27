
const _ = require('lodash');
const jf = require('jsonfile');
const moment = require('moment');
const express = require('express');

function init(app) {
	const router = express.Router();
	const db = app.locals.db;

	router.get('/', function (req, res) {
		res.render('index', {
			images: jf.readFileSync('public/images.json'),
			versions: jf.readFileSync('public/versions.json')
		});
	});

	router.get('/health', function (req, res) {
		res.send("OK");
	});

	router.get('/api/update', function (req, res) {
		require('../lib/jobs/fetch').run({db: db});
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

		const keys = ['country', 'region', 'city', 'band'];
		// Add to filter
		keys.forEach(function (key) {
			if (req.query[key]) {
				var obj = {};
				obj[key] = req.query[key];
				condition = _.merge(condition, obj);
			}
		});

		db.find(condition, {_id: 0}).exec(function (err, docs) {
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
