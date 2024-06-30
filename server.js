const express = require('express');
const cors = require('cors');
const { getLyrics, getSong, searchSong, getSongById } = require('genius-lyrics-api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const GENIUS_ACCESS_TOKEN = 'bvo-JN81MSCiz4axQKZVhcBPFTwNiYXrmqXAr2A0_Et_wbtfPe4kU4h2wYO5hQ7o';

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const options = {
    apiKey: GENIUS_ACCESS_TOKEN,
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
    const song = await getSongById(songId, GENIUS_ACCESS_TOKEN);
    res.json(song);
  } catch (error) {
    console.error('Error fetching song details:', error.message);
    res.status(500).json({ error: 'Error fetching song details' });
  }
});

app.get('/lyrics', async (req, res) => {
  const songPath = req.query.path;
  const options = {
    apiKey: GENIUS_ACCESS_TOKEN,
    title: '',
    artist: '',
    optimizeQuery: true
  };

  try {
    console.log(`Fetching lyrics for path: ${songPath}`);
    const encodedPath = encodeURIComponent(songPath);
    const lyrics = await getLyrics(`https://genius.com${encodedPath}`);
    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found' });
    }
    res.send(lyrics);
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: `Error fetching lyrics: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});