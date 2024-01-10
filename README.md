TV
---
[720p](
https://origin3.afxp.telemedia.co.za/PremiumFree/romanza/abr_satellitechannel/satch_romanza_720p/chunks.m3u8)


[480p](https://mkn-f2l2-589b533f914d.herokuapp.com/watch/3452)

# TV Channel Data Scrapers

This repository contains several Node.js scripts for scraping data about TV channels from a specific website. Each script serves a different purpose and outputs relevant information in JSON format.

## Summary

- [tv.js](tv/tv.js): This script scrapes detailed information about TV channels including their names, icons, descriptions, status, and view counts. The data is stored in [tv.json](tv/tv.json).

- [streamUrls.js](tv/streamUrls.js): This script is designed to extract video stream URLs of TV channels. The URLs are saved in [urls.json](tv/urls.json).

- [social.js](tv/social.js): This script gathers social media links associated with TV channels. The output is saved in [social.json](tv/social.json).

## Files and Scripts

- [node_modules/](node_modules/): Directory containing required Node.js modules.

- [package-lock.json](package-lock.json) and [package.json](package.json): Node.js package configuration files.

- [social.json](tv/social.json): JSON file containing social media links data.

- [social.js](tv/social.js): Script for scraping social media links.

- [social.md](tv/social.md): README file explaining the purpose and usage of [social.js](tv/social.js).

- [streamUrls.json](tv/streamUrls.json): JSON file containing video stream URLs data.

- [streamUrls.js](tv/streamUrls.js): Script for extracting video stream URLs.

- [streamUrls.md](tv/streamUrls.md): README file explaining the purpose and usage of [streamUrls.js](tv/streamUrls.js).

- [tv.json](tv/tv.json): JSON file containing detailed information about TV channels.

- [tv.js](tv/tv.js): Script for scraping TV channel details.

- [tv.md](tv/tv.md): README file explaining the purpose and usage of [tv.js](tv/tv.js).

## Usage

1. Install Node.js on your machine if you haven't already.

2. Install the required packages using npm:

   ```bash
   npm install cheerio axios cors
   ```

3. Run the desired script:

   ```bash
   node scriptName.js
   ```

The resulting JSON files will be generated in the same directory as the respective scripts.

## Notes

- Ensure you have an active internet connection while running the scripts to fetch data from the website.

- Customize the scripts or modify the code as needed to adapt to changes in the website structure.

---
