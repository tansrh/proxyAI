
import 'dotenv/config';
import express, {Request, Response} from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());



app.post('/proxy', async (req: Request, res: Response) => {
  try {
    const { prompt, ...rest } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Missing prompt in request body.' });
    }
    const messages = [
      { role: 'user', content: prompt }
    ];
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Missing OpenRouter API key.' });
    }
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
  model: 'deepseek/deepseek-r1-0528:free',
        messages,
        ...rest
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json({ success: true, response: response.data });
  } catch (error: any) {
    if (error.response) {
      res.status(500).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
