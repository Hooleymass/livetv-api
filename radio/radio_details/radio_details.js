const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();

const baseUrl = 'https://kenyalivetv.co.ke/tv/';

// Method 1: Redirect to the local channel route
app.get('/channel/:name', (req, res) => {
  const channelName = req.params.name.toLowerCase();
  const channelUrl = baseUrl + channelName;

  axios.get(channelUrl)
    .then(response => {
      const $ = cheerio.load(response.data);
      const scrapedData = {};

      // Extract iframe URLs
      $('iframe').each((i, el) => {
        scrapedData.iframe = $(el).attr('src');
      });

      // Extract video source URLs
      $('source').each((i, el) => {
        const sourceType = $(el).attr('type');
        const sourceUrl = $(el).attr('src');
        scrapedData[sourceType] = sourceUrl;
      });

      // Extract social media links
      scrapedData.socialLinks = {};
      $('.social-icons a').each((i, el) => {
        const socialTitle = $(el).attr('title').toLowerCase();
        const socialUrl = $(el).attr('href');
        scrapedData.socialLinks[socialTitle] = socialUrl;
      });

      // Read existing scraped data from file, if any
      let existingData = {};
      try {
        existingData = JSON.parse(fs.readFileSync('scraped.json', 'utf-8'));
      } catch (err) {
        console.log('No existing data found');
      }

      // Merge existing and new data
      const channelNamePretty = existingData[channelName] ? existingData[channelName].name : channelName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const mergedData = { ...existingData, [channelName]: { name: channelNamePretty, data: scrapedData } };

      // Save merged data to file with beautified JSON format
      fs.writeFile('scraped.json', JSON.stringify(mergedData, null, 2), err => {
        if (err) throw err;
        console.log(`Scraped data for '${channelName}' saved to file.`);
      });

      // Return scraped data as response
      res.json(scrapedData);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send(`Channel '${channelName}' not found.`);
    });
});

// Method 2: Get a list of all the TV channels available on the website
app.get('/channels', (req, res) => {
  axios.get(baseUrl)
    .then(response => {
      const $ = cheerio.load(response.data);
      const channels = [];

      $('article.vidme-video-box a').each((i, el) => {
        const channelUrl = baseUrl + $(el).attr('href');
        const channelName = $(el).text().trim();

        channels.push({ name: channelName, url: '/channel/' + channelUrl.replace(baseUrl, '') });
      });

      res.json(channels);
    })
    .catch(error => console.log(error));
});

app.listen(3000, () => console.log('Server running on port 3000'));
