const http = require('http');
const fs = require('fs').promises;
const url = require('url');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, [k, v]) => {
      console.log(k, v);
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http
  .createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    if (req.url.startsWith('/login')) {
      const info = new url.URLSearchParams(req.url.split('?')[1]);
      const name = info.get('name');
      const expires = new Date();

      expires.setMinutes(expires.getMinutes() + 5);
      res.writeHead(302, {
        Location: '/',
        'Set-Cookie': `name=${encodeURIComponent(
          name
        )}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
      });
      res.end();
    } else if (cookies.name) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`<h1>${cookies.name}님 안녕하세요</h1>`);
    } else {
      try {
        const data = await fs.readFile('./cookie2.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(error.massage);
      }
    }
  })
  .listen(8080, () => {
    console.log('open 8080');
  });
