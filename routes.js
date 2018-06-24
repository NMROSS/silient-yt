const channel = require('./model/channel.js')
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

module.exports = router;
