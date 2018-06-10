const express = require('express');
const request = require('request');
const parseXML = require('xml2js').parseString;
const ytdl = require('ytdl-core');
const db = require('./model/db.js');

const app = express();

var subscriptions = [];

// test data
subscriptions.push('istarusIG');
subscriptions.push('tomstanton282');

app.listen(3000, () => {
  syncVideoDB();
});


function syncVideoDB(){
  subscriptions.forEach((channel) => {
    addVideosDB(channel);
  });
}


function addVideosDB(channel){
  parseChannelJSON(channel).then(
    (videos) => {
      videos.forEach((video) => {
        let query = {id : video['id']};

        db.Video.findOneAndUpdate(query, video, {upsert: true},
          (err) => {
            if(err) throw console.log('Error insert/updating document');
          });

        });
    });
}


function parseChannelJSON(channel){
  var videosMetadata = [];

  if(isEmpty(channel)) throw 'channel has no value.';

  return new Promise(
    (resolve, reject) => {
      getChannelJSON(channel).then(
        (result) => {
          let channelTitle = result.feed.title[0];
          let videos  = result.feed.entry;

          videos.forEach((video) => {

            metadata = {
              channel     : channelTitle,
              channelID   : result.feed['yt:channelId'][0],
              id          : video.id[0].replace('yt:video:',''),
              title       : video.title[0],
              description : video['media:group'][0]['media:description'],
              uploaded    : video.published[0],
              thumbnail   : video['media:group'][0]['media:thumbnail'][0].$.url
            }

            videosMetadata.push(metadata);
          });
          resolve(videosMetadata);
        });
      });
    }


function getChannelJSON(channel){
  return new Promise(
    (resolve, reject) => {
      let feedURL = `https://www.youtube.com/feeds/videos.xml?user=${channel}`;

      // TODO - Only request if newer version available to reduce load on youtube and quicker checking.
      //        Check last-modifed or send If-modifed-since in http header
      request({uri : feedURL, gzip : true}, function(error, response, body) {
        parseXML(body, (err, result)=>{
          resolve(result);
        });
      });
    });
  }


function addChannel(channel){
  if (isEmpty(channel)) return; // TODO throw error

  // check if channel already exists
  if (subscriptions.find((x) => x == channel)){
    return;
  }
  subscriptions.push(channel);
}


function removeChannel(channel){
  if (isEmpty(channel)) return; // TODO throw error

  channelIndex = subscriptions.indexOf(channel);
  subscriptions.splice(channelIndex, 1);

}


function isEmpty(string){
  return (string == '' || typeof string === 'undefined');
}


function getStreamURL(videoId) {
  // https://www.npmjs.com/package/react-player
}
/*

Update subscriptions using Cron job every X minutes
List of channels(users subscribed to)
 -> get user feed list (title, video ID, description, release date) [DONE]
    -> Download video [youtube-dl get downnload link]
        -> render video stream


NOTES & Links:
 NPM package for cron job behavior - https://www.npmjs.com/package/cron
 Channel RSS example - https://www.youtube.com/feeds/videos.xml?user=istarusIG
 JSON viewer - http://jsonviewer.stack.hu/
*/
