const channel = require('./model/channel.js')
const youtube = require('./controller/youtube.js')
const express = require('express'),
      router = express.Router();


// Return all channels in DB
router.get('/channels', (req, res) => {
  channel.getChannels()
    .then(channels => res.send(channels));
});

// Return all videos for given channel
router.get('/channel/:channel/', (req, res) => {
  channel.getVideos(req.params.channel)
    .then(videos => res.send(videos));
});

// Add channel to DB 
router.post('/channel/new', (req, res) => {
  
  let channel = req.body.channel;
  youtube.addVideosDB(channel);
  res.send('ok');
  
});

module.exports = router;
