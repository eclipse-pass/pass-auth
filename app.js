require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const httpProxy = require('http-proxy');
const { engine } = require('express-handlebars');
const helmet = require('helmet');
const expressEnforcesSsl = require('express-enforces-ssl');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')();
const strategy = require('./config/passport')(passport, config);

const app = express();
const apiProxy = httpProxy.createProxyServer();

app.set('trust proxy', 1); // trust first proxy
app.set('port', config.app.port);
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const sessionOptions = {
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'This is not a secret, friend.',
  cookie: { httpOnly: true, secure: true, maxAge: 3600000 },
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
if (env !== 'development') {
  app.use(expressEnforcesSsl());
  app.use(helmet());
}
app.use(express.static(path.join(__dirname, 'public')));

require('./config/routes')(app, passport, config, strategy);
require('./config/proxies')(app, apiProxy, config);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
