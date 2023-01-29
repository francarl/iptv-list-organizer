const router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const koa = require('koa');
const mount = require('koa-mount');
const logger = require('koa-logger');
const axios = require('axios');
const readable = require('stream').Readable;


const channelList = ["RAI 1", 
                     "RAI 2", 
                     "RAI 3",
                     "RETE 4",
                    "CANALE 5",
                    "ITALIA 1",
                    "LA 7",
                    "NOVE",
                    "RAI 4",
                    "RAI 4K",
                    "RAI 5",
                    "RAI MOVIE",
                    "RAI STORIA",
                    "RAI PREMIUM",
                    "27 TWENTYSEVEN",
                    "CINE 34",
                    "FOCUS",
                    "IRIS",
                    "ITALIA 1",
                    "ITALIA",
                    "LA 5",
                    "MEDIASET 20",
                    "MEDIASET EXTRA",
                    "TOP CRIME",
                    "DMAX HD",
                    "GIALLO",
                    "REAL TIME HD",
                    "TV 2000",
                    "VH1 ITALIA",
                    "ITALIA 7",
                    "LA7D",
                    "MOTOR TREND",
                    "FOOD NETWORK HD",
                    "FASHION TV",
                    "VIVALDI TV (CLASSIC MUSIC)",
                    "ANTENNA SUD",
                    "TELEBARI",
                    "RAI NEWS 24",
                    "TG COM 24",
                    "TGR PUGLIA",
                    "TELE NORBA (TG NORBA 24 )",
                    "TGCOM24"];
                    

// Create a new koa app.
var app = new koa();

// Create a router for oauth.
var approuter = new router();

// Enable body parsing.
app.use(bodyparser());
app.use(logger());
app.use(mount('/app', approuter.middleware()));

approuter.get('/listm3u', async (ctx) => {
  const response = await axios.get('https://tivustream.website/urls/listm3u', { responseType: 'arraybuffer' });

  const buffer = Buffer.from(response.data, 'binary');

  const s = new readable;
  s.push('#EXTM3U\r\n');

  var channels = buffer.toString('utf-8').replace('#EXTM3U\r\n', '').split('#EXTINF').map(
    channel => {
      channel = "#EXTINF" + channel;
      var firstLine = channel.split('\r\n', 1)[0];
      var channelName = firstLine.split(',')[1];
      if (channelName) {
        // console.log('"' + channelName.toUpperCase().trim() + '",' );
        return {id: channelName.toUpperCase().trim(), data: channel};
      }
    }
  )
  .filter(item => item !== undefined)
  .filter(item => channelList.indexOf(item.id) > -1)
  .sort((a,b) => {
    const index1 = channelList.indexOf(a.id);
    const index2 = channelList.indexOf(b.id)
    return ((index1 > -1 ? index1 : Infinity) - (index2 > -1 ? index2 : Infinity));
  })
  .filter(item => !item.data.endsWith('.avi\r\n'))
  .forEach(item => {
    s.push(item.data);
  })
  s.push(null);

  ctx.body = s;
});

app.listen(3000, () => console.log('Listening 4 on port 3000'));