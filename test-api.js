const http = require('http');

const data = JSON.stringify({
  title: "Test Portfolio",
  items: [
    {
      title: "Test Item",
      cards: [
        {
          descriptions: [
            {
              description: "Test description",
              subDescriptions: ["Sub 1", "Sub 2"]
            }
          ]
        }
      ]
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/admin/portfolio',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
