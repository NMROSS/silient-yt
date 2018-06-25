const channel = require('./model/channel.js')
const youtube = require('./controller/youtube.js')
const express = require('express'),
      router = express.Router();

router.get('/channels', (req, res) => {
  channel.getChannels()
    .then(channels => res.send(channels));
});

router.get('/channel/:channel/', (req, res) => {
  channel.getVideos(req.params.channel)
    .then(videos => res.send(videos));
});

router.post('/channel/new', (req, res) => {
  
  let channel = req.body.channel;
  youtube.addVideosDB(channel);
  res.send();
  
});

module.exports = router;
