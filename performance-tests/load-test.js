import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up to 20 users
    { duration: '1m', target: 20 },  // stay at 20 users
    { duration: '30s', target: 0 },  // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // less than 1% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // 1. Visit Landing Page
  let res = http.get(`${BASE_URL}/`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);

  // 2. Mock Login (Hitting the API if possible, or just simulating the load)
  // In a real scenario, we'd use a test account and get a session cookie
  
  // 3. Fetch Bookings (Simulating an authorized request)
  // res = http.get(`${BASE_URL}/api/bookings`, {
  //   headers: { 'Cookie': 'next-auth.session-token=...' },
  // });
  // check(res, { 'bookings fetch status is 200': (r) => r.status === 200 });
  
  // 4. Submit Support Ticket (Publicly accessible usually)
  const ticketData = JSON.stringify({
    name: 'Performance Test User',
    email: 'perf@test.com',
    subject: 'Load Test',
    message: 'Testing the system under load',
  });
  
  res = http.post(`${BASE_URL}/api/support`, ticketData, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'support ticket submitted': (r) => r.status === 200 || r.status === 201 });
  
  sleep(Math.random() * 2 + 1); // Random sleep between 1-3s
}
