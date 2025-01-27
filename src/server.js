const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const artifactsFolder = path.join(__dirname, 'artifacts');
        if (!fs.existsSync(artifactsFolder)) {
            fs.mkdirSync(artifactsFolder);
        }
        cb(null, artifactsFolder);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.cid}_${file.originalname}`);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to upload file and metadata
app.post('/upload', upload.single('file'), (req, res) => {
    const { cid, metadata } = req.body;

    // Save metadata as a JSON file
    const metadataPath = path.join(__dirname, 'artifacts', `${cid}_metadata.json`);
    fs.writeFileSync(metadataPath, metadata);

    res.status(200).json({ message: 'File and metadata saved successfully.' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
