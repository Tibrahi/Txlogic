import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fix for ES modules: get the directory name and load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (optional - server will run without it)
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
} else {
  console.log('MongoDB not configured - running without database (MONGO_URI not set)');
}

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat History Schema
const chatHistorySchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  userInfo: {
    name: String,
    preferredTracking: String,
    isFirstTime: Boolean,
    contactShared: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// Gemini API Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], userInfo = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build context for Gemini - clean system prompt without hardcoded data
    const systemPrompt = `You are the TxLogic Tracking Assistant, a helpful AI for a logistics and cargo tracking company. 
Your role is to assist users with tracking shipments, answering questions about TxLogic services, and providing support.

Current user context:
- User Name: ${userInfo.name || 'User'}
- Preferred Tracking Type: ${userInfo.preferredTracking || 'Not specified'}
- Is First Time: ${userInfo.isFirstTime !== undefined ? userInfo.isFirstTime : 'Unknown'}

Instructions:
1. Be friendly, professional, and concise
2. If the user asks about tracking, ask for their tracking ID and type (vehicle, package, container)
3. For general questions about TxLogic, provide helpful information
4. If you don't know something specific, offer to connect them with human support
5. Compare the user's input with the conversation context to provide relevant responses
6. Do NOT make up tracking information - only provide real data from the system
7. Remove any programmed/hardcoded responses and generate dynamic, contextual replies

Generate a natural, helpful response based on the user's message and the conversation context.`;

    // Format conversation history for Gemini
    const conversationContext = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`
      : '';

    const fullPrompt = `${systemPrompt}\n\n${conversationContext}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message 
    });
  }
});

// Save Chat History Route
app.post('/api/chat/history', async (req, res) => {
  try {
    const { sessionId, messages, userInfo } = req.body;

    if (!sessionId || !messages) {
      return res.status(400).json({ error: 'Session ID and messages are required' });
    }

    // Upsert chat history
    const chatHistory = await ChatHistory.findOneAndUpdate(
      { sessionId },
      { 
        sessionId, 
        messages, 
        userInfo,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, chatHistory });
  } catch (error) {
    console.error('Save History Error:', error);
    res.status(500).json({ error: 'Failed to save chat history' });
  }
});

// Get Chat History Route
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chatHistory = await ChatHistory.findOne({ sessionId });
    
    if (!chatHistory) {
      return res.json({ messages: [], userInfo: {} });
    }

    res.json(chatHistory);
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// Clear Chat History Route (for removing programmed data)
app.delete('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await ChatHistory.deleteOne({ sessionId });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});