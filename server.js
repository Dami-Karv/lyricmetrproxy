const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const GENIUS_ACCESS_TOKEN = 'your_genius_api_token_here';

app.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get('https://api.genius.com/search', {
      params: { q: query },
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    res.json(response.data.response.hits);
  } catch (error) {
    console.error('Error searching for song:', error.message);
    res.status(500).json({ error: 'Error searching for song' });
  }
});

app.get('/songs/:id', async (req, res) => {
  const songId = req.params.id;

  try {
    const response = await axios.get(`https://api.genius.com/songs/${songId}`, {
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    res.json(response.data.response.song);
  } catch (error) {
    console.error('Error fetching song details:', error.message);
    res.status(500).json({ error: 'Error fetching song details' });
  }
});

app.get('/lyrics', async (req, res) => {
  const songPath = req.query.path;

  try {
    const cleanPath = songPath.startsWith('/') ? songPath.slice(1) : songPath;
    const fullUrl = `https://genius.com/${cleanPath}`;

    const response = await axios.get(fullUrl);
    const lyrics = response.data.match(/<div class="lyrics">((.|\n)*)<\/div>/)[1];

    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found' });
    }
    res.send(lyrics);
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).json({ error: `Error fetching lyrics: ${error.message}` });
  }
});

app.get('/search-artist', async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get('https://api.genius.com/search', {
      params: { q: query },
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    const hits = response.data.response.hits;
    const artists = hits
      .filter(hit => hit.result.primary_artist)
      .map(hit => ({
        id: hit.result.primary_artist.id,
        name: hit.result.primary_artist.name,
        url: hit.result.primary_artist.url
      }));

    const uniqueArtists = Array.from(new Set(artists.map(a => a.id)))
      .map(id => artists.find(a => a.id === id));

    res.json(uniqueArtists);
  } catch (error) {
    console.error('Error searching for artist:', error.message);
    res.status(500).json({ error: 'Error searching for artist: ' + error.message });
  }
});

app.get('/artists/:id/albums', async (req, res) => {
  const artistId = req.params.id;

  try {
    const response = await axios.get(`https://api.genius.com/artists/${artistId}/albums`, {
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    res.json(response.data.response.albums);
  } catch (error) {
    console.error('Error fetching artist albums:', error.message);
    res.status(500).json({ error: 'Error fetching artist albums' });
  }
});

app.get('/albums/:id', async (req, res) => {
  const albumId = req.params.id;

  try {
    const response = await axios.get(`https://api.genius.com/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    res.json(response.data.response.album);
  } catch (error) {
    console.error('Error fetching album details:', error.message);
    res.status(500).json({ error: 'Error fetching album details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
