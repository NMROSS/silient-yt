const channel = require('./model/channel.js')
const express = require('express'),
    router = express.Router();

router.get('/:channel/', (req, res) => {
  channel.getVideos(req.params.channel)
  .then(videos => res.send(videos));
});

module.exports = router;
