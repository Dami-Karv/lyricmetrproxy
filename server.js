const express = require('express');
const cors = require('cors');
const { getLyrics, getSong, searchSong, getSongById } = require('genius-lyrics-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const options = {
    apiKey: process.env.REACT_APP_GENIUS_ACCESS_TOKEN,
    title: query,
    artist: '',
    optimizeQuery: true
  };

  try {
    const results = await searchSong(options);
    res.json(results);
  } catch (error) {
    console.error('Error searching for song:', error.message);
    res.status(500).json({ error: 'Error searching for song' });
  }
});

app.get('/songs/:id', async (req, res) => {
  const songId = req.params.id;

  try {
    const song = await getSongById(songId, process.env.REACT_APP_GENIUS_ACCESS_TOKEN);
    res.json(song);
  } catch (error) {
    console.error('Error fetching song details:', error.message);
    res.status(500).json({ error: 'Error fetching song details' });
  }
});

app.get('/lyrics', async (req, res) => {
  const songPath = req.query.path;
  const options = {
    apiKey: process.env.REACT_APP_GENIUS_ACCESS_TOKEN,
    title: '',
    artist: ''
  };

  try {
    const lyrics = await getLyrics(songPath);
    res.send(lyrics);
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).json({ error: 'Error fetching lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
