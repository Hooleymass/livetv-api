const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

const PORT = 3000;

const url = 'https://www.kenyalivetv.co.ke/tv';

// Read the link.json file
const linkData = fs.readFileSync('./tv_details/link.json');
const links = JSON.parse(linkData);

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
