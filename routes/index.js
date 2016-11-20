
var _ = require('lodash-node');
var jf = require('jsonfile');

var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
	res.render('index', {
		images: jf.readFileSync('public/images.json'),
		versions: jf.readFileSync('public/versions.json')
	});
});

module.exports = router;
