
import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/proxy', async (req, res) => {
  try {
    const { prompt, ...rest } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Missing prompt in request body.' });
    }
    const messages = [
      { role: 'user', content: prompt }
    ];
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      ...rest
    });
    res.status(200).json({success: true, response});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
