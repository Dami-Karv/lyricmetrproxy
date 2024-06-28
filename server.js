const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/songs/:id', async (req, res) => {
  const songId = req.params.id;
  try {
    const response = await axios.get(`https://api.genius.com/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Genius API' });
  }
});

app.get('/lyrics', async (req, res) => {
  const songPath = req.query.path;
  try {
    const response = await axios.get(`https://genius.com${songPath}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
