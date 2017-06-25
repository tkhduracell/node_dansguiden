const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session");
const morgan = require('morgan');
const morganson = require('morgan-json');
const nedb = require('nedb');

/* ==========================================================================
 Envs Setup
 ========================================================================== */
const logger = process.env.NODE_LOGGER || 'default';
const port = process.env.NODE_PORT || 3000;

/* ==========================================================================
 Log Format Setup
 ========================================================================== */
const format = morganson({
  short: ':method :url :status',
  length: ':res[content-length]',
  method: ':method',
  url: ':url',
  status: ':status',
  date: ':date[iso]',
  'response-time': ':response-time',
  'remote-addr': ':remote-addr',
  'remote-user': ':remote-user',
  'http-version': ':http-version',
  referrer: ':referrer',
  'user-agent': ':user-agent'
});

const log = function (msg) {
	console.log(logger === 'morgan' ? JSON.stringify({message: msg}) : msg);
};

/* ==========================================================================
 Express Init
 ========================================================================== */
const app = express();

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
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(logger === 'morgan' ? format : 'combined'));

app.listen(port, function() {
	log('Server started on port ' + port);
});

app.locals.db = new nedb({
	filename: 'dansguiden.db',
	autoload: true
});


/* ==========================================================================
 Routes
 ========================================================================== */
app.use(require("./routes/index")(app));

require('./workers.js')(app);

module.exports = app;
