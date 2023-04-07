import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import httpProxy from 'http-proxy';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import expressEnforcesSsl from 'express-enforces-ssl';
import routes from './config/routes.js';
import proxies from './config/proxies.js';
import configurator from './config/config.js';
import strategy from './config/passport.js';
import cors from 'cors';

const env = process.env.NODE_ENV || 'development';
const config = configurator();
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
app.use(morgan('combined'));
app.use(cookieParser());

// setting up body parser needed for routes accepting xxx-form-url content-type
// posts (e.g. the acs url route)
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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
app.use(express.static('public'));

const options = {
  origin: `${config.app.allowOrigin}`,
  methods: `${config.app.allowMethods}`,
};
app.use(cors(options));

routes(app, passport, config, strategy(passport, config), urlencodedParser);
proxies(app, apiProxy, config);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
