const db = require('./db.js');

module.exports = {
  
  //TODO Error handling on reject

  getChannels: function(){
    return new Promise(
      (resolve, reject) => {
        db.Video.distinct('channelID')
        .exec((err, channels) => {
          resolve(channels)     
        })
      }
    )
  },

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
