import express from 'express';
import helmet from 'helmet';
import noCache from 'nocache';
import cors from 'cors';
import logger from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { errorHandler } from "./errors/ErrorHandler";
import routes from './routes';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(helmet());
app.use(noCache());
app.use(helmet.xssFilter());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    `default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline'`
  );
  next();
});

routes(app);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

app.use(errorHandler);
app.all('*', (req, res, next) => { res.redirect('/404'); });

export = app;