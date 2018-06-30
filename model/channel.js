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

    return new Promise(
      (resolve, reject) => {
        
        if (isNaN(days))
          reject(days + ' : is not a number');

        recentDate.setDate(recentDate.getDate() - days);

        let query = { uploaded: { $gte: new Date(recentDate) } }

        db.Video.find(query).sort({uploaded : -1}).exec((err, videos) => {
          resolve(videos);
        });

      }
    )

  }
}
