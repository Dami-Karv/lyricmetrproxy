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

  try {
    const lyrics = await getLyrics(songPath);
    res.send(lyrics);
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).json({ error: 'Error fetching lyrics' });
  }
});

app.get('/artists/:id/albums', async (req, res) => {
  // Placeholder implementation as the `genius-lyrics-api` does not provide a direct method for this
  const artistId = req.params.id;
  const options = {
    apiKey: process.env.REACT_APP_GENIUS_ACCESS_TOKEN,
    id: artistId
  };

  try {
    // Fetch artist details and albums here if `genius-lyrics-api` provides such functionality
    res.status(501).json({ error: 'Not Implemented' });
  } catch (error) {
    console.error('Error fetching artist albums from Genius API:', error.message);
    res.status(500).json({ error: 'Error fetching artist albums from Genius API' });
  }
});

app.get('/albums/:id', async (req, res) => {
  // Placeholder implementation as the `genius-lyrics-api` does not provide a direct method for this
  const albumId = req.params.id;
  const options = {
    apiKey: process.env.REACT_APP_GENIUS_ACCESS_TOKEN,
    id: albumId
  };

  try {
    // Fetch album details here if `genius-lyrics-api` provides such functionality
    res.status(501).json({ error: 'Not Implemented' });
  } catch (error) {
    console.error('Error fetching album details from Genius API:', error.message);
    res.status(500).json({ error: 'Error fetching album details from Genius API' });
  }
});

app.get('/albums/:id/tracks', async (req, res) => {
  // Placeholder implementation as the `genius-lyrics-api` does not provide a direct method for this
  const albumId = req.params.id;
  const options = {
    apiKey: process.env.REACT_APP_GENIUS_ACCESS_TOKEN,
    id: albumId
  };

  try {
    // Fetch album tracks here if `genius-lyrics-api` provides such functionality
    res.status(501).json({ error: 'Not Implemented' });
  } catch (error) {
    console.error('Error fetching album tracks from Genius API:', error.message);
    res.status(500).json({ error: 'Error fetching album tracks from Genius API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
