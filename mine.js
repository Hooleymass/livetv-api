const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { ruruHTML } = require("ruru/server");
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

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type ChannelEdge {
    cursor: String!
    node: Channel!
  }

  type ChannelConnection {
    edges: [ChannelEdge!]!
    pageInfo: PageInfo!
  }

  type Query {
    channels(cursor: String, limit: Int): ChannelConnection!
    channel(id: Int!): Channel
  }
`);

// Define your resolver functions
const root = {
  channels: ({ cursor, limit = 10 }) => {
    const startIndex = cursor ? mergedData.findIndex(item => item.id.toString() === cursor) + 1 : 0;
    const paginatedData = mergedData.slice(startIndex, startIndex + limit);
    const hasNextPage = startIndex + limit < mergedData.length;
    const endCursor = hasNextPage ? mergedData[startIndex + limit - 1].id.toString() : null;
    return {
      edges: paginatedData.map(node => ({ cursor: node.id.toString(), node })),
      pageInfo: { hasNextPage, endCursor },
    };
  },
  channel: ({ id }) => mergedData.find(channel => channel.id === id),
};

// Define the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL UI for testing
}));

// Serve the GraphiQL IDE using ruruHTML
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Define a REST API endpoint for TV channels with pagination
app.get('/api', (req, res) => {
  let { cursor = 0, limit = 10 } = req.query;
  cursor = parseInt(cursor); // Ensure cursor is an integer
  limit = parseInt(limit); // Ensure limit is an integer

  // Calculate start and end indices for pagination
  const startIndex = cursor;
  const endIndex = startIndex + limit;

  // Slice the mergedData based on calculated indices
  const paginatedData = mergedData.slice(startIndex, endIndex);

  // Return paginated data
  res.json(paginatedData);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

