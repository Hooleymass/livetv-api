### README.md

---

# TV Channel API

This API provides information about TV channels, including their names, icons, stream URLs, descriptions, social media links, status, and views.

## Endpoints

### Get All TV Channels

**Endpoint**: `GET /tv`

**Description**: Returns a list of all TV channels with their information.

**Example Request**:

```
GET /tv
```

**Example Response**:

```json
[
  {
    "id": 1,
    "name": "Channel 1",
    "icon": "https://example.com/channel1_icon.png",
    "thumbnail": "https://example.com/channel1_thumbnail.png",
    "streamUrls": [
      "https://example.com/channel1_stream1",
      "https://example.com/channel1_stream2"
    ],
    "description": "Description for Channel 1",
    "social": {
      "Facebook": "https://facebook.com/channel1",
      "Twitter": "https://twitter.com/channel1"
    },
    "status": "Online",
    "views": "100,000 views"
  },
  // More channels...
]
```

### Get TV Channel by ID

**Endpoint**: `GET /tv/:id`

**Description**: Returns information about a specific TV channel based on its ID.

**Parameters**:

- `id`: The ID of the TV channel.

**Example Request**:

```
GET /tv/1
```

**Example Response**:

```json
{
  "tv": {
    "id": 1,
    "name": "Channel 1",
    "icon": "https://example.com/channel1_icon.png",
    "thumbnail": "https://example.com/channel1_thumbnail.png",
    "streamUrls": [
      "https://example.com/channel1_stream1",
      "https://example.com/channel1_stream2"
    ],
    "description": "Description for Channel 1",
    "social": {
      "Facebook": "https://facebook.com/channel1",
      "Twitter": "https://twitter.com/channel1"
    },
    "status": "Online",
    "views": "100,000 views"
  }
}
```

## Usage

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node server.js
   ```

   The server will start on `http://localhost:3000`.

3. Access the API using the provided endpoints.

---
