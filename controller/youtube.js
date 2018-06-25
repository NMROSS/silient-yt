const db = require('../model/db.js');
const parseXML = require('xml2js').parseString;
const request = require('request'); 

module.exports = {


    addVideosDB: (channel) => {
        parseChannelJSON(channel).then(
            (videos) => {
                videos.forEach((video) => {
                    let query = { id: video['id'] };

                    db.Video.findOneAndUpdate(query, video, { upsert: true },
                        (err) => {
                            if (err) throw console.log('Error insert/updating document');
                        });
                });
            });
    },


    parseChannelJSON: function (channel) {
        var videosMetadata = [];

        if (this.isEmpty(channel)) throw 'channel has no value.';

        return new Promise(
            (resolve, reject) => {
                this.getChannelJSON(channel).then(
                    (result) => {
                        let channelTitle = result.feed.title[0];
                        let videos = result.feed.entry;

                        videos.forEach((video) => {

                            metadata = {
                                channel: {
                                    name: channelTitle,
                                    id: result.feed['yt:channelId'][0]
                                },
                                id: video.id[0].replace('yt:video:', ''),
                                title: video.title[0],
                                description: video['media:group'][0]['media:description'],
                                uploaded: video.published[0],
                                thumbnail: video['media:group'][0]['media:thumbnail'][0].$.url
                            }

                            videosMetadata.push(metadata);
                        });
                        resolve(videosMetadata);
                    });
            });
    },


    getChannelJSON: function (channel) {
        return new Promise(
            (resolve, reject) => {
                let feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`;

                // TODO - Only request if newer version available to reduce load on youtube and quicker checking.
                //        Check last-modifed or send If-modifed-since in http header
                request({ uri: feedURL, gzip: true }, function (error, response, body) {
                    parseXML(body, (err, result) => {
                        resolve(result);
                    });
                });
            });
    },

    isEmpty: function(string){
        return (string == '' || typeof string === 'undefined');
      }
}