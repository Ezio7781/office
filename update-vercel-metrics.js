const https = require('https');

const VERCEL_URL = 'https://office-1.vercel.app'; // Change this to your Vercel URL

const data = {
  alpha: { achieved: 8.5, target: 10, name: 'Team Alpha' },
  rebel: { achieved: 9.2, target: 10, name: 'Team Rebel' }
};

const postData = JSON.stringify(data);

const url = new URL(`${VERCEL_URL}/api/metrics`);

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let responseData = '';
  res.on('data', (d) => {
    responseData += d;
  });
  res.on('end', () => {
    console.log(responseData);
    console.log('\nMetrics updated successfully on Vercel!');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();