const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

// Load data from JSON files
const tvData = JSON.parse(fs.readFileSync('./tv/tv.json'));
const urlsData = JSON.parse(fs.readFileSync('./tv/urls.json'));
const socialData = JSON.parse(fs.readFileSync('./tv/social.json'));
let updates = [];
if (fs.existsSync('./tv/update.json')) {
  updates = JSON.parse(fs.readFileSync('./tv/update.json'));
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

// Define your GraphQL schema
const schema = buildSchema(`
  type Channel {
    id: Int!
    name: String!
    icon: String!
    thumbnail: String!
    streamUrls: [String!]!
    description: String!
    social: SocialInfo!
    status: String!
    views: Int!
  }

  type SocialInfo {
    facebook: String
    twitter: String
    instagram: String
  }

  type Query {
    tvChannels(cursor: Int, limit: Int): [Channel!]!
  }
`);

// Define your resolver functions
const root = {
  tvChannels: ({ cursor = 0, limit = 10 }) => {
    const paginatedData = mergedData.slice(cursor, cursor + limit);
    return paginatedData;
  },
};

// Define the GraphQL endpoint using express-graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL UI for testing
}));

// Define a REST API endpoint for TV channels with pagination
app.get('/api', (req, res) => {
  const { cursor = 0, limit = 10 } = req.query;
  const paginatedData = mergedData.slice(cursor, cursor + limit);
  res.json(paginatedData);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

