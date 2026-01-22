
const https = require('https');

const appId = 'a1a0566c';
const appKey = '82417530a16e158b8a60664d77bd8280';
const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&what=developer&where=london&content_type=application/json`;

console.log(`Fetching: ${url}`);

https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body:', data.substring(0, 500)); // Print first 500 chars
    });

}).on('error', (e) => {
    console.error('Error:', e);
});
