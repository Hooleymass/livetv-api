const fs = require('fs');

// read the cleaned.json file
const data = JSON.parse(fs.readFileSync('cleaned.json'));

// create an object for stream_url data
const streamUrlData = {};
// create an object for socialLinks data
const socialLinksData = {};

// loop through the data and split into two objects
Object.keys(data).forEach(key => {
  const channel = data[key];
  const streamUrl = channel.data.stream_url;
  const socialLinks = channel.data.socialLinks;

  streamUrlData[channel.name] = streamUrl;
  socialLinksData[channel.name] = socialLinks;
});

// write the new objects to separate files
fs.writeFileSync('stream_url.json', JSON.stringify(streamUrlData, null, 2));
fs.writeFileSync('socialLinks.json', JSON.stringify(socialLinksData, null, 2));

