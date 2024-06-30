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
    const artists = hits.filter(hit => hit.result.primary_artist.url.includes('/artists/'))
                        .map(hit => ({
                          id: hit.result.primary_artist.id,
                          name: hit.result.primary_artist.name,
                          url: hit.result.primary_artist.url
                        }));

    // Remove duplicates based on artist ID
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
    const response = await axios.get(`https://api.genius.com/artists/${artistId}/songs`, {
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    const songs = response.data.response.songs;
    const albums = [...new Set(songs.map(song => song.album))].filter(album => album !== null);

    res.json(albums);
  } catch (error) {
    console.error('Error fetching artist albums:', error.message);
    res.status(500).json({ error: 'Error fetching artist albums' });
  }
});

app.get('/artists/:id/songs', async (req, res) => {
  const artistId = req.params.id;

  try {
    const response = await axios.get(`https://api.genius.com/artists/${artistId}/songs`, {
      headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
    });

    const songs = response.data.response.songs;
    res.json(songs);
  } catch (error) {
    console.error('Error fetching artist songs:', error.message);
    res.status(500).json({ error: 'Error fetching artist songs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
