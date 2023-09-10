streamurls.js
---

# TV Channel Stream URLs Scraper

This script is designed to scrape video stream URLs of TV channels from a specific website. It utilizes Node.js along with the Axios and Cheerio libraries for making HTTP requests, parsing HTML, and extracting video URLs.

## How it Works

1. The script starts by sending an HTTP GET request to a target URL where TV channels are listed.

2. It extracts links to individual TV channels from the HTML content.

3. For each channel, it sends another HTTP GET request to the specific URL of the channel.

4. It extracts JavaScript code from the fetched content, which contains an array of video stream URLs.

5. If the video URLs are found, they are added to the list of URLs along with an ID.

6. The script saves the collected URLs to a JSON file named `urls.json`.

## Usage

1. Install Node.js on your machine if you haven't already.

2. Install the required packages using npm:

   ```bash
   npm install cheerio axios
   ```

3. Run the script:

   ```bash
   node streamUrls.js
   ```

The resulting `urls.json` file will be generated in the same directory as the script.

## Output Format

The generated `urls.json` file will contain a JSON object with an array of objects. Each object represents a set of video stream URLs for a specific TV channel. The structure will be as follows:

```json
{
  "urls": [
    {
      "id": 1,
      "streamUrls": ["url1", "url2", "url3", ...]
    },
    {
      "id": 2,
      "streamUrls": ["url4", "url5", "url6", ...]
    },
    // More objects as per the number of video stream URLs fetched
  ]
}
```

Please note that the actual URLs will be specific to the website you are scraping.

---
