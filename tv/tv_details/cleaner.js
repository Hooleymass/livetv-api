const fs = require('fs');

// Load the original JSON file
const data = fs.readFileSync('scraped.json');
const originalJson = JSON.parse(data);

// Create a new JSON object with renamed stream_url key and null values for missing links or values
const newJson = {};
for (const key in originalJson) {
  newJson[key] = {
    name: originalJson[key].name,
    data: {
      stream_url: originalJson[key].data.iframe || originalJson[key].data['application/x-mpegURL'] || null,
      socialLinks: {
        facebook: originalJson[key].data.socialLinks.facebook || null,
        whatsapp: originalJson[key].data.socialLinks.whatsapp || null,
        twitter: originalJson[key].data.socialLinks.twitter || null,
        instagram: originalJson[key].data.socialLinks.instagram || null,
        youtube: originalJson[key].data.socialLinks.youtube || null,
        website: originalJson[key].data.socialLinks.website || null,
        app: originalJson[key].data.socialLinks.app || null,
      }
    }
  };
}

// Write the new JSON file
fs.writeFileSync('cleaned.json', JSON.stringify(newJson, null, 2));
