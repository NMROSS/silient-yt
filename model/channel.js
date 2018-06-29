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
  },

  getRecent: function (days) {
    let recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - days);
    
    let query = {uploaded : {$gte : new Date(recentDate)}}

    return new Promise(
      (resolve, reject) => {
        db.Video.find(query).exec((err, videos) => {
          console.log(videos);
          
          resolve(videos);
        });

      }
    )

  }
}
