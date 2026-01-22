
const https = require('https');
const fs = require('fs');

const appId = 'a1a0566c';
const appKey = '82417530a16e158b8a60664d77bd8280';
const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&what=developer&where=london`;

console.log(`--- DEBUG START ---`);
console.log(`URL: ${url}`);

https.get(url, (res) => {
    let log = `STATUS:${res.statusCode}\nHEADERS:${JSON.stringify(res.headers)}\n`;
    console.log(`STATUS: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        log += `BODY_START:${data.substring(0, 500)}\n`;
        fs.writeFileSync('status.txt', log);
        console.log('Done writing status.txt');
    });

}).on('error', (e) => {
    fs.writeFileSync('status.txt', `ERROR:${e.message}`);
    console.error(e);
});
