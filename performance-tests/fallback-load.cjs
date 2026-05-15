const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENCY = 5;
const DURATION_MS = 10000; // 10 seconds

async function runTest() {
  console.log(`Starting fallback load test against ${BASE_URL}`);
  console.log(`Concurrency: ${CONCURRENCY}, Duration: ${DURATION_MS}ms`);

  let totalRequests = 0;
  let successfulRequests = 0;
  const start = Date.now();

  const workers = Array.from({ length: CONCURRENCY }).map(async (_, i) => {
    while (Date.now() - start < DURATION_MS) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.get(BASE_URL, (res) => {
            totalRequests++;
            if (res.statusCode === 200) successfulRequests++;
            res.on('data', () => {});
            res.on('end', resolve);
          });
          req.on('error', reject);
        });
      } catch (err) {
        totalRequests++;
        // console.error(`Worker ${i} error:`, err.message);
      }
    }
  });

  await Promise.all(workers);

  const end = Date.now();
  const actualDuration = (end - start) / 1000;
  
  console.log('\n--- Results ---');
  console.log(`Duration: ${actualDuration.toFixed(2)}s`);
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Successful Requests: ${successfulRequests}`);
  console.log(`Requests per second: ${(totalRequests / actualDuration).toFixed(2)}`);
  console.log(`Success Rate: ${((successfulRequests / totalRequests) * 100).toFixed(2)}%`);
}

runTest().catch(console.error);
