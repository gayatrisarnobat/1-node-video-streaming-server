const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/videoplayer', (req, res) => {
  const range = req.headers.range;
  console.log('Range: ', range);
  const videoPath = path.join(
    __dirname,
    'public',
    'assets',
    'videos',
    'ek-duje-ke-vaaste.MP4'
  );
  const videoSize = fs.statSync(videoPath).size;
  console.log('Size: ', videoSize);
  const chunkSize = 1 * 1e6;
  console.log('Chunk: ', chunkSize);
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  console.log('Start, end, content length: ', start, end, contentLength);
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
});

app.listen(3000);
