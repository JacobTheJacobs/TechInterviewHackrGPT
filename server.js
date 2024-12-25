import express from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import os from 'os';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(express.static('public'));
app.use(express.json());

async function transcribeAudio(audioBuffer, mimeType) {
  try {
    // Create a temporary file to store the audio
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp_audio_${Date.now()}.wav`);
    await fs.writeFile(tempFilePath, audioBuffer);

    // Create form data
    const formData = new FormData();
    formData.append('file', await fs.readFile(tempFilePath), {
      filename: 'audio.wav',
      contentType: mimeType
    });
    formData.append('model', 'whisper-large-v3');

    // Make request to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    // Clean up temporary file
    await fs.unlink(tempFilePath);

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Transcribe using Groq Whisper API
    const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);

    // Get answer from Groq Chat
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
                        You are an expert real-time technical interview assistant. Provide immediate, concise answers to help the candidate during the interview. Your responses must:

                        1. Be direct and brief (1 sentences max for concepts, 4-5 lines max for code)
                        2. For technical questions:
                           - Include minimal working code examples when relevant
                           - Highlight key terms with **bold**
                           - Focus on practical implementation
                        3. Format responses as:
                           Concept: [Brief technical explanation with **highlighted terms** and new lines for fast and easy reading]
                        Remember: You're providing real-time assistance, not feedback. Be direct.`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024
    });

    const answer = completion.choices[0].message.content;

    res.json({
      success: true,
      transcript,
      answer
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
