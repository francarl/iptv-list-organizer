var Router = require('koa-router');
var bodyparser = require('koa-bodyparser');
var koa = require('koa');
var model = require('./in-memory-model');
var mount = require('koa-mount');
var oauthserver = require('koa-oauth-server');

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

app.use(bodyparser());
app.use(app.oauth.authorise());

app.use(function *(next) {
  this.body = 'Secret area';
  yield next;
});

app.listen(3000, () => console.log('Listening on port 3000'));