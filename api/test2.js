/*const express = require('express');
const app = express();




app.get('/videos/search', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  const results = db.videos.filter(video => {
    const nameMatch = video.name.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = video.description.toLowerCase().includes(query.toLowerCase());

    return nameMatch || descriptionMatch;
  });

  return res.json(results);
});

app.listen(3000, () => console.log('Server is listening on port 3000'));

const express = require('express');
const fs = require('fs');
const app = express();

// Read the contents of the JSON file containing the videos database
const videosData = fs.readFileSync('./db.json');
const videosDb = JSON.parse(videosData);

app.get('/videos/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  const results = videosDb.videos.filter(video => {
    const nameMatch = video.name.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = video.description.toLowerCase().includes(query.toLowerCase());
    return nameMatch || descriptionMatch;
  });

  return res.json(results);
});

app.listen(3000, () => console.log('Server is listening on port 3000'));
*/


const express = require('express');
const fs = require('fs');
const app = express();

// Read the contents of the JSON file containing the videos database
const videosData = fs.readFileSync('./TV.json');
const videosDb = JSON.parse(videosData);


app.get('/videos', (req, res) => {
  return res.json(videosDb);
});

app.get('/videos/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  const results = videosDb.videos.filter(video => {
    const nameMatch = video.name.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = video.description.toLowerCase().includes(query.toLowerCase());
    return nameMatch || descriptionMatch;
  });

  return res.json(results);
});

app.get('/channels/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  const results = videosDb.channels.filter(channel => {
    const nameMatch = channel.name.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = channel.description.toLowerCase().includes(query.toLowerCase());
    return nameMatch || descriptionMatch;
  });

  return res.json(results);
});

app.listen(3000, () => console.log('Server is listening on port 3000'));

