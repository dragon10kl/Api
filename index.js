const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('audio'), (req, res) => {
    const audioPath = req.file.path;
    const outputPath = `${audioPath}.mp4`;

    const cmd = `ffmpeg -i "${audioPath}" -f lavfi -i color=c=black:s=720x720:d=30 -vf "format=yuv420p" -c:a aac -shortest -y "${outputPath}"`;

    exec(cmd, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Conversion failed');
        }

        res.download(outputPath, 'output.mp4', () => {
            fs.unlinkSync(audioPath);
            fs.unlinkSync(outputPath);
        });
    });
});

app.listen(3000, () => console.log('🚀 API running on port 3000'));
