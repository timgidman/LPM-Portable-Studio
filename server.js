import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({
  dest: path.join(__dirname, 'tmp'),
  limits: { fileSize: 30 * 1024 * 1024 }
});

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'LPM Portable Studio',
    transcription: process.env.OPENAI_API_KEY ? 'enabled' : 'disabled-no-api-key',
    time: new Date().toISOString()
  });
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  let uploadedPath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No audio file uploaded.' });
    }
    const client = getClient();
    if (!client) {
      return res.status(500).json({
        ok: false,
        error: 'OPENAI_API_KEY is not set yet.',
        setup_hint: 'Add OPENAI_API_KEY in Render, then redeploy.'
      });
    }

    const fileBuffer = await fs.readFile(uploadedPath);
    const audioFile = await OpenAI.toFile(fileBuffer, req.file.originalname, {
      type: req.file.mimetype || 'audio/mpeg'
    });

    const response = await client.audio.transcriptions.create({
      file: audioFile,
      model: process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe',
      language: 'en',
      prompt: 'Transcribe sung English lyrics clearly. Return only the lyric text.'
    });

    res.json({
      ok: true,
      text: response.text || '',
      filename: req.file.originalname
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: 'Server transcription failed.',
      detail: error?.message || 'Unknown error'
    });
  } finally {
    if (uploadedPath) {
      try { await fs.unlink(uploadedPath); } catch {}
    }
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`LPM Portable Studio running on port ${port}`);
});
