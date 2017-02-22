var express = require('express');
var session = require('express-session');
var http = require('http');
var ParseServer = require('parse-server').ParseServer;

var SocialOAuth2 = require('./lib/index').default;

// configuration
var port = 3030;
process.env.SERVER_URL = 'http://localhost:' + port + '/parse';
process.env.APP_ID = "Y58uDAh9445hEaGtwaJ3GnAMI10Bpk3b";
process.env.MASTER_KEY = "jt9gh7frZ32Y5Q698RP87F55R41pPdx1";
process.env.FB_APPIDS = ["1360181184056097"];
process.env.FB_SECRETS = ["cc50007848c429374e89bd2c5202e404"];
process.env.INSTA_APPIDS = ["6b5bf7aef2eb4296961fe43af1858a3c"];
process.env.INSTA_SECRETS = ["dbbc1c52f4da47c6a86f2f081e82598c"];

// app
var app = express();

// parse-server
var api = new ParseServer({
  databaseURI: 'mongodb://localhost/test',
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  auth: {
    facebook: {
      appIds: process.env.FB_APPIDS
    }
  }
});

// Serve the MiddleWare(Parse) on the /parse URL prefix
app.use('/parse', api);

var server = new http.Server(app);

app.use(session({
  secret: 'parse-oauth2-sns',
  resave: false,
  saveUninitialized: false,
  // cookie: { maxAge: 60000 }
}));

// OAuth2
app.use('/oauth2', SocialOAuth2.create({ path: '/oauth2' }));

// default
app.use((req, res) => {
  res.status(404).json({ code: 101, error: 'api not found' }).end();
});

// run server
var runnable = app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info('----\n==> 🌎  API is running on port %s', port);
  console.info('==> 💻  Send requests to http://%s:%s', 'localhost', port);
});
