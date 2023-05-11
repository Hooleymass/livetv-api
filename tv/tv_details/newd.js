const fs = require('fs');

// read the cleaned.json file
const data = JSON.parse(fs.readFileSync('cleaned.json'));

// create an object to store the data
const newData = {};

// loop through the data and restructure it
Object.keys(data).forEach((key, index) => {
  const channel = data[key];

  newData[channel.name] = {
    id: index + 1, // add ID field
    streamUrl: channel.data.stream_url,
    socialLinks: channel.data.socialLinks
  };
});

// write the new data to a file
fs.writeFileSync('newData.json', JSON.stringify(newData, null, 2));

