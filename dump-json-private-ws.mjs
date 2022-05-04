import * as qs from 'querystring';
import { URL } from 'url';
import { createHmac } from 'crypto';
import { request as httpsRequest } from 'https';
import WebSocket from 'ws';

const apiKey = '';
const apiSec = '';

const request = (url, options) => new Promise((res, rej) => {
  let reply = '';
  const req = httpsRequest(url, options, (rr) => {
    rr.on('data', (d) => {
      reply += d.toString();
    });
    rr.on('error', (e) => rej(e));
    rr.on('end', () => res(reply));
  });
  req.end();
});

function getSignedURL(baseURL, sigObj) {
  const u = new URL(baseURL);
  const hasher = createHmac('sha256', apiSec);
  hasher.update(qs.stringify(sigObj));
  u.search = qs.stringify({
    ...sigObj,
    signature: hasher.digest('hex'),
  });
  return u;
}

(async () => {
  async function getListenKey() {
    const reqUrl = getSignedURL('https://fapi.binance.com/fapi/v1/listenKey', {});
    const lk = await request(reqUrl, { method: 'POST', headers: { 'X-MBX-APIKEY': apiKey } });
    return JSON.parse(lk).listenKey;
  }

  const lk = await getListenKey();
  const ws = new WebSocket(`wss://fstream.binance.com/ws/${lk}`);

  ws.on('open', () => {
    console.log(`ws open; lk=${lk}`);
  });

  ws.on('message', (msg) => {
    console.log(msg.toString());
  });

  // ws.on('close',() => {})
})();
