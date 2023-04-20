const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const PORT = 3000;
const url = 'https://www.kenyalivetv.co.ke/tv';

// Define empty JSON objects for links and social links
let links = {};
let socialLinks = {};

// Read the link.json file if it exists
const linkDataPath = './tv_details/stream_url.json';
if (fs.existsSync(linkDataPath)) {
  const linkData = fs.readFileSync(linkDataPath);
  links = JSON.parse(linkData);
}

// Read the social_links.json file if it exists
const socialDataPath = './tv_details/socialLinks.json';
if (fs.existsSync(socialDataPath)) {
  const socialData = fs.readFileSync(socialDataPath);
  socialLinks = JSON.parse(socialData);
}

const extractChannels = (html) => {
  const $ = cheerio.load(html);
  const channels = [];

  $('.vidme-video-box').each((i, el) => {
    const name = $(el).find('.name a').text().trim();
    const description = $(el).find('.tv-short-description').text().trim();
    const thumbnail = $(el).find('.vidme-video-thumbnail img').attr('src');
    const liveCounter = $(el).find('.live-counter div').text().trim();
    const url = links[name]; // get the URL for the current channel

    channels.push({
      name,
      description,
      thumbnail: `https://kenyalivetv.co.ke/${thumbnail.slice(3)}`,
      liveCounter,
      url // add the URL to the channel object
    });
  });

  return channels;
};

// Route to display the links JSON object
app.get('/links', (req, res) => {
  res.json(links);
});

// Route to display the social links JSON object
app.get('/social', (req, res) => {
  res.json(socialLinks);
});

// Route to display a specific channel by name
app.get('/channels/:name', (req, res) => {
  const channelName = req.params.name;
  const channelUrl = links[channelName];
  if (channelUrl) {
    res.json({ name: channelName, url: channelUrl });
  } else {
    res.status(404).json({ error: `Channel ${channelName} not found` });
  }
});

app.get('/', (req, res) => {
  axios.get(url)
    .then((response) => {
      const channels = extractChannels(response.data);
      res.json({ channels });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Error occurred while extracting channels' });
    });
});

// Add route to update stream URLs
app.put('/links', express.json(), (req, res) => {
  const newData = req.body;
  links = newData;
  fs.writeFile(linkDataPath, JSON.stringify(newData), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error occurred while updating stream URLs' });
    } else {
      res.json({ message: 'Stream URLs updated successfully' });
    }
  });
});

// Add route to update social links
app.put('/social', express.json(), (req, res) => {
  const newData = req.body;
  socialLinks = newData;
  fs.writeFile(socialDataPath, JSON.stringify(newData), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error occurred while updating social links' });
    } else {
      res.json({ message: 'Social links updated successfully' });
    }
  });
});

// Add route to add new channel
app.post('/channels', express.json(), (req, res) => {
  const { name, description, thumbnail, liveCounter, url } = req.body;
  if (!name || !url) {
    res.status(400).json({ error: 'Both name and URL are required to add a channel' });
    return;
  }
  if (links[name]) {
    res.status(400).json({ error: 'A channel with the same name already exists' });
    return;
  }
  links[name] = url;
  const newChannel = { name, description, thumbnail, liveCounter, url };
  fs.writeFile(linkDataPath, JSON.stringify(links), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error occurred while adding channel' });
    } else {
      res.json({ message: 'Channel added successfully', newChannel });
    }
  });
});

// Add route to delete channel
app.delete('/channels/:name', (req, res) => {
  const { name } = req.params;
  if (!links[name]) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }
  delete links[name];
  fs.writeFile(linkDataPath, JSON.stringify(links), (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error occurred while deleting channel' });
    } else {
      res.json({ message: 'Channel deleted successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

