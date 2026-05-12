const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

let salesData = {
  alpha: { achieved: 0, target: 10, name: 'Team Alpha' },
  rebel: { achieved: 0, target: 10, name: 'Team Rebel' },
  total: { achieved: 0, target: 20, name: 'Branch Total' }
};

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'GET' && req.url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(salesData), 'utf-8');
    return;
  }

  if (req.method === 'POST' && req.url === '/api/metrics') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newData = JSON.parse(body);
        salesData.alpha = newData.alpha || salesData.alpha;
        salesData.rebel = newData.rebel || salesData.rebel;
        salesData.total = newData.total || {
          achieved: salesData.alpha.achieved + salesData.rebel.achieved,
          target: salesData.alpha.target + salesData.rebel.target,
          name: 'Branch Total'
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(salesData), 'utf-8');
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }), 'utf-8');
      }
    });
    return;
  }

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT'){
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      }
      else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
      }
    }
    else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});