var Router = require('koa-router');
var bodyparser = require('koa-bodyparser');
var koa = require('koa');
var mount = require('koa-mount');
var oauthserver = require('koa-oauth-server');
var inMemoryModel = require('./in-memory-model');

var model = new inMemoryModel();

model.dump();

// Create a new koa app.
var app = new koa();

// Create a router for oauth.
var router = new Router();

// Enable body parsing.
app.use(bodyparser());

// See https://github.com/thomseddon/node-oauth2-server for specification.
app.oauth = oauthserver({
  model: model,
  grants: ['password'],
  debug: true
});

// Mount `oauth2` route prefix.
app.use(mount('/oauth2', router.middleware()));

// Register `/token` POST path on oauth router (i.e. `/oauth2/token`).
router.post('/token', app.oauth.grant());


app.listen(3000, () => console.log('Listening on port 3000'));