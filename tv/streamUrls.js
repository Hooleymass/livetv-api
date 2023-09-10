const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const targetUrl = 'https://kenyalivetv.co.ke/tv/';
const delayBetweenSets = 5000; // Delay in milliseconds between sets of parallel requests (5 seconds)
const parallelRequestCount = 5; // Number of parallel requests to perform in each set

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(`Error fetching data for ${url}:`, error.message);
    return null;
  }
}

(async () => {
  const html = await fetchData(targetUrl);
  if (!html) return;

  const $ = cheerio.load(html);
  const links = $('article a[href]').map((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('http')) {
      return targetUrl + href;
    }
    return href;
  }).get();

  const urlsArray = [];
  const processedUrls = new Set();
  const totalSets = Math.ceil(links.length / parallelRequestCount);

  for (let setIndex = 0; setIndex < totalSets; setIndex++) {
    const start = setIndex * parallelRequestCount;
    const end = Math.min((setIndex + 1) * parallelRequestCount, links.length);
    const fetchUrlsPromises = links.slice(start, end).map(url => fetchData(url));

    const responses = await Promise.all(fetchUrlsPromises);

    responses.forEach((html, index) => {
      if (!html || processedUrls.has(links[start + index])) return;

      const url = links[start + index];
      processedUrls.add(url);

      const $ = cheerio.load(html);
      const scriptTagContent = $('script')
        .filter((_, el) => !$(el).attr('src'))
        .map((_, el) => $(el).html())
        .get()
        .join('');

      // Clean up the scriptTagContent to remove invalid control characters
      const cleanedScriptTagContent = scriptTagContent.replace(/[\x00-\x1F\x7F]/g, '');

      const regex = /function\s+playVideo\(videoIndex\)\s*\{(?:.|\n)*?var\s+videoUrls\s*=\s*(\[[^\]]*\])/;
      const match = cleanedScriptTagContent.match(regex);

      if (match && match[1]) {
        const videoUrlsArray = JSON.parse(match[1]);
        urlsArray.push({
          id: urlsArray.length + 1,
          streamUrls: videoUrlsArray
        });
      } else {
        console.log(`videoUrls array not found in the script tag for ${url}.`);
      }
    });

    // Add a delay between sets to avoid overloading the server
    await new Promise(resolve => setTimeout(resolve, delayBetweenSets));
  }

  // Save the URLs data to a JSON file
  const urlsObject = { urls: urlsArray };
  fs.writeFileSync('urls.json', JSON.stringify(urlsObject, null, 2));

  console.log('URLs data saved to urls.json');
})();

