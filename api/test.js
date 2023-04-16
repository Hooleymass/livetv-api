// Define the base URL for the API
const baseUrl = 'https://hooleymass.github.io/api/channels.json';

// Define the ID of the channel you want to get data for
const channelId = 'romanza-africa';

// Define the ID of the playlist you want to get data for
const playlistId = 'romanza-playlist';

// Make a GET request to the channel details endpoint
fetch(`${baseUrl}/${channelId}`)
  .then(response => response.json())
  .then(data => {
    // Do something with the channel details
    console.log('Channel details:', data);
  })
  .catch(error => {
    console.error('Error fetching channel details:', error);
  });

// Make a GET request to the channel videos endpoint
fetch(`${baseUrl}/${channelId}/videos`)
  .then(response => response.json())
  .then(data => {
    // Do something with the channel videos
    console.log('Channel videos:', data);
  })
  .catch(error => {
    console.error('Error fetching channel videos:', error);
  });

// Make a GET request to the playlist videos endpoint
fetch(`${baseUrl}/${channelId}/playlists/${playlistId}/videos`)
  .then(response => response.json())
  .then(data => {
    // Do something with the playlist videos
    console.log('Playlist videos:', data);
  })
  .catch(error => {
    console.error('Error fetching playlist videos:', error);
  });

// Make a GET request to the playlist details endpoint
fetch(`${baseUrl}/${channelId}/playlists/${playlistId}`)
  .then(response => response.json())
  .then(data => {
    // Do something with the playlist details
    console.log('Playlist details:', data);
  })
  .catch(error => {
    console.error('Error fetching playlist details:', error);
  });

