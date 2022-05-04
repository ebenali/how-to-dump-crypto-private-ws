# how-to-dump-crypto-private-ws

Illustrates how to dump cryptocurrency exchange account private channel contents.

Only Binance USDT; No persistence, can add save to S3 or mongoDB

## How to
```bash
node --version                                               # needs version that supports running .mjs, something around v14
git clone https://github.com/<repo-url>
cd how-to-dump-crypto-private-ws
npm install                                                  # install dependencies like `ws'
vim dump-json-private-ws.mjs                                 # edit dump script, add API credentials
node dump-json-private-ws.mjs
```
