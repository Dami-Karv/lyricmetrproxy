const express = require('express');
const cors = require('cors');
const axios = require('axios');
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

  try {
    console.log(`Fetching lyrics for path: ${songPath}`);
    
    // Remove the leading slash if present
    const cleanPath = songPath.startsWith('/') ? songPath.slice(1) : songPath;
    
    // Construct the full URL without encoding
    const fullUrl = `https://genius.com/${cleanPath}`;
    
    console.log(`Attempting to fetch lyrics from: ${fullUrl}`);
    
    const lyrics = await getLyrics(fullUrl);
    
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

app.get('/search-artist', async (req, res) => {
  const query = req.query.q;
  const options = {
    apiKey: GENIUS_ACCESS_TOKEN,
    title: query,
    optimizeQuery: true
  };

  try {
    const results = await searchSong(options);
    // Filter results to only include artists
    const artists = results.filter(result => result.type === 'artist');
    res.json(artists);
  } catch (error) {
    console.error('Error searching for artist:', error.message);
    res.status(500).json({ error: 'Error searching for artist' });
  }
});

app.get('/artist-albums/:artistId', async (req, res) => {
  const artistId = req.params.artistId;

  try {
    const response = await axios.get(`https://api.genius.com/artists/${artistId}/albums`, {
      headers: { 'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });
    res.json(response.data.response.albums);
  } catch (error) {
    console.error('Error fetching artist albums:', error.message);
    res.status(500).json({ error: 'Error fetching artist albums' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});