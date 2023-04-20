const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const url = 'https://www.kenyalivetv.co.ke/tv';
const fs = require('fs');
const request = require('request');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');
const $ = require('jquery')(window);

// Define empty JSON objects for links and social links
let links = {};
let socialLinks = {};

// Read the link.json file if it exists
const linkDataPath = './tv/tv_details/stream_url.json';
if (fs.existsSync(linkDataPath)) {
    links = JSON.parse(fs.readFileSync(linkDataPath));
}

// Read the social_links.json file if it exists
const socialDataPath = './tv/tv_details/socialLinks.json';
if (fs.existsSync(socialDataPath)) {
    socialLinks = JSON.parse(fs.readFileSync(socialDataPath));
}

function extractChannels(html) {
    const channels = [];

    const $html = $(html);
    $html.find('.vidme-video-box').each(function() {
        const name = $(this).find('.name a').text().trim();
        const description = $(this).find('.tv-short-description').text().trim();
        const thumbnail = `https://kenyalivetv.co.ke/${$(this).find('.vidme-video-thumbnail img').attr('src').substring(3)}`;
        const liveCounter = $(this).find('.live-counter div').text().trim();
        const url = links[name]; // get the URL for the current channel

        channels.push({
            'name': name,
            'description': description,
            'thumbnail': thumbnail,
            'liveCounter': liveCounter,
            'url': url // add the URL to the channel object
        });
    });

    return channels;
}

// Route to display the links JSON object
app.get('/links', (req, res) => {
    res.json(links);
});

// Route to display the social links JSON object
app.get('/social', (req, res) => {
    res.json(socialLinks);
});

// Route to display a specific channel by name
app.get('/channels/:name', (req, res) => {
    const channelUrl = links[req.params.name];
    if (channelUrl) {
        res.json({'name': req.params.name, 'url': channelUrl});
    } else {
        res.status(404).json({'error': `Channel ${req.params.name} not found`});
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('WELCOME TO MY LIVE TV API HOME<br><br>' +
        '<a href="/links">Links</a><br>' +
        '<a href="/social">Social Links</a><br>' +
        '<a href="/channels">Channels</a>');
});

app.get('/channels', (req, res) => {
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const channels = extractChannels(body);
            res.json({'channels': channels});
        } else {
            res.status(500).json({'error': 'Error occurred while extracting channels'});
        }
    });
});

// Add route to update stream URLs
app.put('/links', (req, res) => {
    const newData = req.body;
    links = newData;
    fs.writeFileSync(linkDataPath, JSON.stringify(newData));
    res.json({'message': 'Stream URLs updated successfully'});
});

// Add route to update social links
app.put('/social', (req, res) => {
    const newData = req.body;
    socialLinks = newData;
    fs.writeFileSync(socialDataPath, JSON.stringify(newData));
    res.json({'message': 'Social links updated successfully'});
});

// Add route to add new channel
app.post('/channels', (req, res) => {
    const data = req.body;
    const name = data.name;
    const url = data.url;
    if (!name || !url) {
        res.status(400).json({'error': 'Both name and URL are required to add a channel'});
    } else if (name in links) {
        res.status(400).json({'error': 'A channel with the same name already exists'});
    } else {
        links[name] = url;
        const newChannel = {
            'name': name,
            'description': data.description,
            'thumbnail': data.thumbnail,
            'liveCounter': data.liveCounter,
            'url': url
        };
        fs.writeFileSync(linkDataPath, JSON.stringify(links));
        res.json({'message': 'Channel added successfully', 'newChannel': newChannel});
    }
});

// Add route to delete channel
app.delete('/channels/:name', (req, res) => {
    if (!(req.params.name in links)) {
        res.status(404).json({'error': 'Channel not found'});
    } else {
        delete links[req.params.name];
        fs.writeFileSync(linkDataPath, JSON.stringify(links));
        res.json({'message': 'Channel deleted successfully'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
