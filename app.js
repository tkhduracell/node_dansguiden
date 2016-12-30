var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var app = express();

/* ==========================================================================
 Jade Setup
 ========================================================================== */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('layout', '_layout');

/* ==========================================================================
 Misc Setup
 ========================================================================== */
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(parseInt(process.env.NODE_PORT));

/* ==========================================================================
 Locals Setup
 ========================================================================== */

/* ==========================================================================
 Routes
 ========================================================================== */
app.use(require("./routes/index"));

module.exports = app;
