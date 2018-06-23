const db = require('./db.js');

module.exports = {
  getVideos: function(channelID){
    return new Promise(
      (resolve, reject) => {
        db.Video.find({channelID : channelID})
        .exec((err, videos) => {
          resolve(videos);
        });
      }
    )
  }
}
