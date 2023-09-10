const cheerio = require('cheerio');
const axios = require('axios');

const mainUrl = 'https://kenyalivetv.co.ke/tv/';

axios.get(mainUrl)
  .then(async (response) => {
    const $ = cheerio.load(response.data);
    const tvCards = $('.tv-card');

    for (let index = 0; index < tvCards.length; index++) {
      const relativeUrl = $(tvCards[index]).find('a').attr('href');
      const tvUrl = `https://kenyalivetv.co.ke/tv/${relativeUrl}`;
      const tvResponse = await axios.get(tvUrl);
      const tv$ = cheerio.load(tvResponse.data);

      const socialLinks = {};

      tv$('.social-icons a').each((index, element) => {
        const socialName = $(element).attr('title');
        const socialLink = $(element).attr('href');
        if (socialName !== undefined) {
          socialLinks[socialName] = socialLink;
        }
      });

      const thumbnailRelativeUrl = tv$('.channel-thumbnail').attr('src');
      const thumbnail = `https://kenyalivetv.co.ke${thumbnailRelativeUrl}`;

      const tvData = {
        id: index + 1,
        thumbnail,
        social: socialLinks
      };

      console.log(tvData);
    }
  })
  .catch((error) => {
    console.error(error);
  });
