// Tiny local web server for Work It: `node serve.js` then open http://localhost:5173
// Serving over http (instead of double-clicking index.html) lets Strava send you straight back after "Authorize".
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, port = process.env.PORT || 5173;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.csv': 'text/csv' };
http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(root, p === '/' ? 'index.html' : p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).on('error', e => {
  if (e.code === 'EADDRINUSE') console.log(`Work It is already running – just open http://localhost:${port}`);
  else console.error(e.message);
  process.exit(1);
}).listen(port, '127.0.0.1', () => console.log(`Work It running at http://localhost:${port}  (keep this window open; Ctrl+C to stop)`));
