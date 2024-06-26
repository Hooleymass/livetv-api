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

// Validation middleware
function validateParams(req, res, next) {
  let { cursor, limit } = req.query;

  // Validate cursor (should be a non-negative integer)
  cursor = parseInt(cursor);
  if (isNaN(cursor) || cursor < 0) {
    return res.status(400).json({ error: "Invalid cursor value. Must be a non-negative integer." });
  }

  // Validate limit (should be a positive integer)
  limit = parseInt(limit);
  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ error: "Invalid limit value. Must be a positive integer." });
  }

  // Attach validated values to request object
  req.validatedParams = { cursor, limit };
  next();
}

// Define sorting options
const SORT_OPTIONS = {
  name: (a, b) => a.name.localeCompare(b.name),
  views: (a, b) => a.views - b.views,
  status: (a, b) => a.status.localeCompare(b.status),
  // Add more sorting options as needed
};

/* Define the REST API endpoint for TV channels with pagination, sorting, and filtering
app.get('/api', validateParams, (req, res) => {
  const { cursor, limit } = req.validatedParams;
  let { sort, filterStatus, filterViews } = req.query;

  // Default sort by channel ID
  sort = SORT_OPTIONS[sort] ? sort : 'id';

  // Apply sorting to mergedData
  let sortedData = mergedData.sort(SORT_OPTIONS[sort]);

  // Filter based on status if provided
  if (filterStatus) {
    sortedData = sortedData.filter(channel => channel.status === filterStatus);
  }

  // Filter based on views if provided
  if (filterViews) {
    const minViews = parseInt(filterViews);
    sortedData = sortedData.filter(channel => channel.views >= minViews);
  }

  // Apply pagination to sorted and filtered data
  const paginatedData = sortedData.slice(cursor, cursor + limit);

  res.json(paginatedData);
});*/

// Define the REST API endpoint for TV channels with pagination, sorting, and filtering
app.get('/api', validateParams, (req, res) => {
  const { cursor, limit } = req.validatedParams;
  let { sort, filterStatus, filterViews } = req.query;

  // Default sort by channel ID
  sort = SORT_OPTIONS[sort] ? sort : 'id';

  // Apply sorting to mergedData
  let sortedData = mergedData.sort(SORT_OPTIONS[sort]);

  // Filter based on status if provided
  if (filterStatus) {
    sortedData = sortedData.filter(channel => channel.status === filterStatus);
  }

  // Filter based on views if provided
  if (filterViews) {
    const minViews = parseInt(filterViews);
    sortedData = sortedData.filter(channel => channel.views >= minViews);
  }

  // Calculate the correct indices after sorting and filtering
  const startIndex = cursor;
  const endIndex = startIndex + limit;

  // Apply pagination to sorted and filtered data
  const paginatedData = sortedData.slice(startIndex, endIndex);

  res.json(paginatedData);
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

