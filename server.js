require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { getLyrics, getSong, searchSong, getSongById } = require('genius-lyrics-api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const GENIUS_ACCESS_TOKEN = process.env.REACT_APP_GENIUS_ACCESS_TOKEN || 'bvo-JN81MSCiz4axQKZVhcBPFTwNiYXrmqXAr2A0_Et_wbtfPe4kU4h2wYO5hQ7o';

// Endpoint to search for songs
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

// Endpoint to get details of a song by ID
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

// Endpoint to get lyrics of a song by path
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

// Endpoint to search for an artist
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

// Endpoint to get songs of an artist by ID
app.get('/artists/:id/songs', async (req, res) => {
  const artistId = req.params.id;
  let page = 1;
  let allSongs = [];

  try {
    while (true) {
      const response = await axios.get(`https://api.genius.com/artists/${artistId}/songs`, {
        params: { page },
        headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
      });

      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      const songs = response.data.response.songs;
      if (songs.length === 0) break;

      allSongs = allSongs.concat(songs);
      page++;
    }

    // Sort the songs by release date
    allSongs.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

    res.json(allSongs);
  } catch (error) {
    console.error('Error fetching artist songs:', error.message);
    console.error('Error Response:', error.response.data);
    res.status(500).json({ error: 'Error fetching artist songs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
