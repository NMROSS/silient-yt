const db = require('./db.js');

module.exports = {
  
  //TODO Error handling on reject

  getChannels: function(){
    return new Promise(
      (resolve, reject) => {
        db.Video.distinct('channel')
        .exec((err, channels) => {
          resolve(channels)     
        })
      }
    )
  },

  getVideos: function(channelID){
    return new Promise(
      (resolve, reject) => {
        db.Video.find({"channel.id" : channelID})
        .exec((err, videos) => {
          resolve(videos);
        });
      }
    )
  }
}
