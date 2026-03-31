const axios = require('axios');
const client = axios.create({ baseURL: '/backend' });
console.log("TEST 1 (/api/challenges):", client.getUri({ url: '/api/challenges' }));
console.log("TEST 2 (api/challenges):", client.getUri({ url: 'api/challenges' }));
