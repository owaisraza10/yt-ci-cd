const express = require('express');
const { spawn } = require('child_process');
const app = express();

// Fake web endpoint so Render knows the app is "healthy"
app.get('/', (req, res) => res.send('Stream is live!'));
app.listen(10000, () => console.log('Web server listening on port 10000'));

// The background stream pipeline
function startStream() {
    console.log("Starting stream...");
    // Replace YOUR_STREAM_KEY below
    const stream = spawn('bash', ['-c', 'yt-dlp -4 --proxy "http://42.115.72.145:2026" --cookies cookies.txt --extractor-args "youtube:client=android" --remote-components ejs:github -o - "https://www.youtube.com/watch?v=eC4LfEVxvKg" | ffmpeg -i pipe:0 -c:v copy -c:a aac -ac 1 -ar 22050 -b:a 48k -af "aecho=0.8:0.9:1000:0.3,asetrate=41624,aresample=22050,atempo=1.0594" -f flv rtmp://a.rtmp.youtube.com/live2/7p7s-bcz3-9781-5p7f-4w32']);

    stream.stdout.on('data', (data) => console.log(`Data: ${data}`));
    stream.stderr.on('data', (data) => console.error(`Log: ${data}`));

    stream.on('close', (code) => {
        console.log(`Stream stopped (Code ${code}). Auto-restarting in 5 seconds...`);
        setTimeout(startStream, 5000);
    });
}

startStream();
