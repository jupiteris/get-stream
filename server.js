import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI as OpenAIStream } from "openai-streams/node";
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/stream', bodyParser.json(), async function (req, res) {
  const { input } = req.body;
  const stream = await OpenAIStream(
    "chat",
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `${input}`,
        },
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
    },
    { apiKey: process.env.KEY }
  );

  stream.pipe(res);
});


app.listen(4000, function () {
  console.log('Server is Ready on 4000');
});