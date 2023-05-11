const fs = require('fs');

// read the cleaned.json file
const data = JSON.parse(fs.readFileSync('cleaned.json'));

// create an object for stream_url data
const streamUrlData = {};

// create an object for socialLinks data
const socialLinksData = {};

// loop through the data and split into two objects
Object.keys(data).forEach((key, index) => {
  const channel = data[key];
  const streamUrl = channel.data.stream_url;
  const socialLinks = channel.data.socialLinks;

  streamUrlData[channel.name] = {
    id: index + 1, // add ID field
    streamUrl: streamUrl
  };

  socialLinksData[channel.name] = {
    id: index + 1, // add ID field
    socialLinks: socialLinks
  };
});

// write the new objects to separate files
fs.writeFileSync('stream_url.json', JSON.stringify(streamUrlData, null, 2));
fs.writeFileSync('socialLinks.json', JSON.stringify(socialLinksData, null, 2));

