require('newrelic');

const express = require('express');
const compression = require('compression')
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const debug = require('debug')('app:init');


/* ==========================================================================
 Envs Setup
 ========================================================================== */
const port = process.env.NODE_PORT || 3000;

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
app.use(morgan('combined'));
app.use(compression());

app.listen(port, function() {
	debug('Server started on port ' + port);
});

app.locals.db = require('./lib/db').setup();
app.locals.jobs = require('./lib/workers.js')(app);

/* ==========================================================================
 Routes
 ========================================================================== */
app.use(require("./routes/index")(app));

module.exports = app;
