tv.js
---

# TV Channel Information Scraper

This script is designed to scrape information about TV channels from a specific website. It utilizes Node.js along with the Axios and Cheerio libraries for making HTTP requests, parsing HTML, and extracting channel details.

## How it Works

1. The script starts by sending an HTTP GET request to a target URL where TV channels are listed.

2. It uses Cheerio to parse the HTML content of the page, allowing it to extract specific information such as channel icons, names, descriptions, status, and view counts.

3. For each channel, it extracts the relevant information and constructs an object.

4. The channel data is then stored in an array.

5. Finally, the array of channel data is written to a JSON file named `tv.json`.

## Usage

1. Install Node.js on your machine if you haven't already.

2. Install the required packages using npm:

   ```bash
   npm install cheerio axios
   ```

3. Run the script:

   ```bash
   node tv.js
   ```

The resulting `tv.json` file will be generated in the same directory as the script.

## Output Format

The generated `tv.json` file will contain a JSON array of objects. Each object represents a TV channel and includes the following information:

- **ID**: A unique identifier for the channel.
- **Name**: The name of the channel.
- **Icon**: The URL of the channel's icon image.
- **Description**: A brief description of the channel.
- **Status**: Whether the channel is online or offline.
- **Views**: The number of views for the channel.

Here is an example of how the output in `tv.json` might look:

```json
[
  {
    "id": 1,
    "name": "Channel Name 1",
    "icon": "https://kenyalivetv.co.ke/icon1.jpg",
    "description": "Description of Channel 1",
    "status": "Online",
    "views": "1000"
  },
  {
    "id": 2,
    "name": "Channel Name 2",
    "icon": "https://kenyalivetv.co.ke/icon2.jpg",
    "description": "Description of Channel 2",
    "status": "Offline",
    "views": "500"
  },
  // ... More TV channels ...
]
```

Please note that the actual data will depend on the structure and content of the website you are scraping.

---
