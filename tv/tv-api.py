import os
import json
import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request

app = Flask(__name__)
PORT = int(os.environ.get('PORT', 5000))
url = 'https://www.kenyalivetv.co.ke/tv'

# Define empty JSON objects for links and social links
links = {}
socialLinks = {}

# Read the link.json file if it exists
linkDataPath = './tv_details/stream_url.json'
if os.path.exists(linkDataPath):
    with open(linkDataPath, 'r') as f:
        links = json.load(f)

# Read the social_links.json file if it exists
socialDataPath = './tv_details/socialLinks.json'
if os.path.exists(socialDataPath):
    with open(socialDataPath, 'r') as f:
        socialLinks = json.load(f)

def extractChannels(html):
    soup = BeautifulSoup(html, 'html.parser')
    channels = []

    for el in soup.select('.vidme-video-box'):
        name = el.select_one('.name a').text.strip()
        description = el.select_one('.tv-short-description').text.strip()
        thumbnail = el.select_one('.vidme-video-thumbnail img')['src']
        liveCounter = el.select_one('.live-counter div').text.strip()
        url = links.get(name) # get the URL for the current channel

        channels.append({
            'name': name,
            'description': description,
            'thumbnail': f"https://kenyalivetv.co.ke/{thumbnail[3:]}",
            'liveCounter': liveCounter,
            'url': url # add the URL to the channel object
        })

    return channels

# Route to display the links JSON object
@app.route('/links')
def get_links():
    return jsonify(links)

# Route to display the social links JSON object
@app.route('/social')
def get_social_links():
    return jsonify(socialLinks)

# Route to display a specific channel by name
@app.route('/channels/<name>')
def get_channel(name):
    channelUrl = links.get(name)
    if channelUrl:
        return jsonify({'name': name, 'url': channelUrl})
    else:
        return jsonify({'error': f'Channel {name} not found'}), 404

# Home route
@app.route('/')
def home():
    return 'WELCOME TO MY LIVE TV API HOME<br><br>' + \
        '<a href="/links">Links</a><br>' + \
        '<a href="/social">Social Links</a><br>' + \
        '<a href="/channels">Channels</a>'

@app.route('/channels')
def get_channels():
    response = requests.get(url)
    if response.status_code == 200:
        channels = extractChannels(response.text)
        return jsonify({'channels': channels})
    else:
        return jsonify({'error': 'Error occurred while extracting channels'}), 500

# Add route to update stream URLs
@app.route('/links', methods=['PUT'])
def update_links():
    newData = request.get_json()
    global links
    links = newData
    with open(linkDataPath, 'w') as f:
        json.dump(newData, f)
    return jsonify({'message': 'Stream URLs updated successfully'})

# Add route to update social links
@app.route('/social', methods=['PUT'])
def update_social_links():
    newData = request.get_json()
    global socialLinks
    socialLinks = newData
    with open(socialDataPath, 'w') as f:
        json.dump(newData, f)
    return jsonify({'message': 'Social links updated successfully'})

# Add route to add new channel
@app.route('/channels', methods=['POST'])
def add_channel():
    data = request.get_json()
    name = data.get('name')
    url = data.get('url')
    if not name or not url:
        return jsonify({'error': 'Both name and URL are required to add a channel'}), 400
    if name in links:
        return jsonify({'error': 'A channel with the same name already exists'}), 400
    links[name] = url
    newChannel = {
        'name': name,
        'description': data.get('description'),
        'thumbnail': data.get('thumbnail'),
        'liveCounter': data.get('liveCounter'),
        'url': url
    }
    with open(linkDataPath, 'w') as f:
        json.dump(links, f)
    return jsonify({'message': 'Channel added successfully', 'newChannel': newChannel})

# Add route to delete channel
@app.route('/channels/<name>', methods=['DELETE'])
def delete_channel(name):
    if name not in links:
        return jsonify({'error': 'Channel not found'}), 404
    del links[name]
    with open(linkDataPath, 'w') as f:
        json.dump(links, f)
    return jsonify({'message': 'Channel deleted successfully'})

if __name__ == '__main__':
    app.run(port=PORT, debug=True)
