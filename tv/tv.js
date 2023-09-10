const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const url = 'https://kenyalivetv.co.ke/tv/';
axios.get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);

    const tvCards = $('.tv-card');

    const tvDataArray = [];

    tvCards.each((index, element) => {
      const iconRelativeUrl = $(element).find('.img-container img').attr('src');
      const icon = `https://kenyalivetv.co.ke/${iconRelativeUrl.replace('../', '')}`;
      const name = $(element).find('h2 a').text();
      const description = $(element).find('.tv-description').text();
      const status = $(element).find('.tv-status').hasClass('fa-fade') ? 'Offline' : 'Online';
      const views = $(element).find('.tv-views').text().trim();

      const tvData = {
        id: index + 1,
        name,
        icon,
        description,
        status,
        views
      };

      tvDataArray.push(tvData);
    });

    fs.writeFileSync('tv.json', JSON.stringify(tvDataArray, null, 2));

    console.log('TV data saved to tv.json');
  })
  .catch((error) => {
    console.error(error);
  });

