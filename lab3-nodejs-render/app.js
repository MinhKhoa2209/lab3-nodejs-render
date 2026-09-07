const http = require('http');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>Hello World</h1>');
});

server.listen(port, host, () => {
  console.log(`Server running at http://localhost:${port}`);
});