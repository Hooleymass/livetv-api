const newData = JSON.parse(fs.readFileSync('newData.json'));

// access the data for a specific channel
const channelName = 'myChannel';
const channelData = newData[channelName];
console.log(channelData);

