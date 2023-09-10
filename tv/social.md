social.js
---

# TV Channel Scraper

This script is designed to scrape information about TV channels from a specific website. It utilizes Node.js along with the Axios and Cheerio libraries for making HTTP requests and parsing HTML, respectively.

## How it Works

1. The script starts by sending an HTTP GET request to the main URL of the website where the TV channels are listed.

2. It then uses Cheerio to parse the HTML content of the page, allowing it to extract specific information such as links to individual TV channel pages.

3. For each channel, the script follows a similar process:
   - It constructs the URL of the channel page.
   - It sends another HTTP GET request to this specific URL.
   - It uses Cheerio to extract social media links associated with the channel.

4. The gathered information (channel ID, thumbnail URL, and social media links) is stored in an array.

5. Finally, the array of channel data is written to a JSON file named `social.json`.

## Output

The output of this script is a JSON file (`social.json`) containing an array of objects. Each object represents a TV channel and includes the following information:

- **ID**: A unique identifier for the channel.
- **Thumbnail**: The URL of the channel's thumbnail image.
- **Social**: A list of social media links associated with the channel.

Here is an example of how the output in `social.json` might look:

```json
[
  {
    "id": 1,
    "thumbnail": "https://kenyalivetv.co.ke/thumbnails/channel1.jpg",
    "social": {
      "Facebook": "https://www.facebook.com/channel1",
      "Twitter": "https://twitter.com/channel1"
    }
  },
  {
    "id": 2,
    "thumbnail": "https://kenyalivetv.co.ke/thumbnails/channel2.jpg",
    "social": {
      "Facebook": "https://www.facebook.com/channel2",
      "Instagram": "https://www.instagram.com/channel2"
    }
  },
  // ... More TV channels ...
]
```

## How to Use

1. Install Node.js on your machine if you haven't already.

2. Install the required packages using npm:

   ```bash
   npm install cheerio axios
   ```

3. Run the script:

   ```bash
   node social.js
   ```

The resulting `social.json` file will be generated in the same directory as the script.

---
