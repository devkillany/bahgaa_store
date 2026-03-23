import fs from 'fs';
import https from 'https';

const url = "https://ibb.co/yFbRPdPm";

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<meta property="og:image" content="([^"]+)"/);
    if (match) {
      fs.writeFileSync('directUrl.txt', match[1]);
      console.log('Done');
    } else {
      console.log('Not found');
    }
  });
}).on('error', console.error);
