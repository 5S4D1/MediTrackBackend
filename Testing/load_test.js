import http from 'k6/http';
import { check, sleep } from 'k6';

// Load test stages
export let options = {
  stages: [
    { duration: '20s', target: 5 },   // ramp-up to 5 users
    { duration: '40s', target: 10 },  // ramp-up to 10 users
    { duration: '20s', target: 0 },   // ramp-down
  ],
};

// Pre-generated Firebase ID tokens (replace with real ones)
const idTokens = [
  'Your_Token', // token 1
  // add more tokens if you want
];

export default function () {
  // Pick a random token for each request (optional rotation)
  const idToken = idTokens[Math.floor(Math.random() * idTokens.length)];

  // 1. Call /check endpoint (creates Firestore user if not exists)
  const checkRes = http.get('http://localhost:3000/user/check', {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  check(checkRes, {
    '/check status 200': (r) => r.status === 200,
    'user exists or created': (r) => r.json('uid') !== undefined,
  });

  // 2. Call /profile endpoint
  const profileRes = http.get('http://localhost:3000/user/profile', {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  check(profileRes, {
    '/profile status 200': (r) => r.status === 200,
    'uid returned': (r) => r.json('uid') !== undefined,
  });

  sleep(1);
}
