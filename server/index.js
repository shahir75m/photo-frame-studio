import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Frame } from './models/Frame.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 image strings

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
} else {
  console.warn('⚠️ MONGODB_URI not found in .env file. Database will not connect.');
}

// Routes

// Get all custom frames
app.get('/api/frames', async (req, res) => {
  try {
    const frames = await Frame.find().sort({ createdAt: -1 });
    res.json(frames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch frames' });
  }
});

// Add a new frame
app.post('/api/frames', async (req, res) => {
  try {
    const { id, name, imageUrl, aspectRatio, isDefault } = req.body;
    const newFrame = new Frame({ id, name, imageUrl, aspectRatio, isDefault });
    await newFrame.save();
    res.status(201).json(newFrame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save frame' });
  }
});

// Delete a frame
app.delete('/api/frames/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Frame.findOneAndDelete({ id });
    res.json({ message: 'Frame deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete frame' });
  }
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
