const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Added cors middleware

const app = express();

// Allow all origins for CORS
app.use(cors());

// Load data from JSON files
const tvData = JSON.parse(fs.readFileSync('./tv/tv.json'));
const urlsData = JSON.parse(fs.readFileSync('./tv/urls.json'));
const socialData = JSON.parse(fs.readFileSync('./tv/social.json'));

// Load updates (if available)
let updates = [];
if (fs.existsSync('./tv/update.json')) {
  updates = JSON.parse(fs.readFileSync('./tv/update.json'));
} else {
  console.log('No update available');
}

// Merge the data to create the final TV channel information
const mergedData = tvData.map(channel => {
  const urlsInfo = urlsData.urls.find(urlInfo => urlInfo.id === channel.id);
  const socialInfo = socialData[channel.id - 1];
  const streamUrls = urlsInfo ? urlsInfo.streamUrls.filter(url => url.trim() !== "") : [];

  const update = updates.find(u => u.id === channel.id);
  if (update) {
    Object.assign(channel, update.updates);
  }

  return {
    id: channel.id,
    name: channel.name,
    icon: channel.icon,
    thumbnail: socialInfo ? socialInfo.thumbnail : '',
    streamUrls: (streamUrls || []).concat(update && update.updates && update.updates.streamUrls ? update.updates.streamUrls : []),
    description: channel.description,
    social: socialInfo ? { ...socialInfo.social, thumbnail: undefined } : {},
    status: (streamUrls || []).length > 0 || (update && update.updates && update.updates.streamUrls && update.updates.streamUrls.length > 0) ? 'Online' : 'Offline',
    views: channel.views
  };
});

// Define the API endpoint to get all TV channel information
app.get('/tv', (req, res) => {
  res.json(mergedData);
});

// Define the API endpoint to get TV channel information by ID
app.get('/tv/:id', (req, res) => {
  const channelId = parseInt(req.params.id);
  const channelInfo = mergedData.find(channel => channel.id === channelId);
  if (channelInfo) {
    res.json({ tv: channelInfo });
  } else {
    res.status(404).json({ error: 'TV channel not found' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

