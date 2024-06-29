const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GENIUS_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching search results from Genius API:', error.message);
    res.status(500).json({ error: 'Error fetching search results from Genius API' });
  }
});

app.get('/songs/:id', async (req, res) => {
  const songId = req.params.id;
  try {
    const response = await axios.get(`https://api.genius.com/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GENIUS_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching song from Genius API:', error.message);
    res.status(500).json({ error: 'Error fetching song from Genius API' });
  }
});

app.get('/lyrics', async (req, res) => {
  const songPath = req.query.path;
  const url = `https://genius.com${songPath}`;
  console.log(`Fetching lyrics from URL: ${url}`);
  try {
    const response = await axios.get(url);
    console.log('Response from Genius lyrics page:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching lyrics from Genius:', error.message);
    res.status(500).json({ error: 'Error fetching lyrics from Genius' });
  }
});

app.get('/artists/:id/albums', async (req, res) => {
  const artistId = req.params.id;
  try {
    const response = await axios.get(`https://api.genius.com/artists/${artistId}/albums`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GENIUS_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching artist albums from Genius API:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error details:', error);
    }
    res.status(500).json({ error: 'Error fetching artist albums from Genius API' });
  }
});

app.get('/albums/:id', async (req, res) => {
  const albumId = req.params.id;
  try {
    const response = await axios.get(`https://api.genius.com/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GENIUS_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching album details from Genius API:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error details:', error);
    }
    res.status(500).json({ error: 'Error fetching album details from Genius API' });
  }
});

app.get('/albums/:id/tracks', async (req, res) => {
  const albumId = req.params.id;
  try {
    const response = await axios.get(`https://api.genius.com/albums/${albumId}/tracks`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GENIUS_ACCESS_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching album tracks from Genius API:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error details:', error);
    }
    res.status(500).json({ error: 'Error fetching album tracks from Genius API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
