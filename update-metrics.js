const http = require('http');

const data = {
  alpha: { achieved: 8.5, target: 10, name: 'Team Alpha' },
  rebel: { achieved: 9.2, target: 10, name: 'Team Rebel' }
};

const postData = JSON.stringify(data);

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/metrics',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
    console.log('\nMetrics updated successfully!');
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(postData);
req.end();