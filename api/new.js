fetch('https://hooleymass.github.io/livetv-api/api/channels.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.channels[0].name);
  })
  .catch(error => {
    console.error('Error fetching channel data:', error);
  });

