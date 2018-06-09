const express = require('express');
const request = require('request');
const parseXML = require('xml2js').parseString;
const ytdl = require('ytdl-core');
const db = require('./model/db.js');

const app = express();

var subscriptions = [];

// test data
subscriptions.push('istarusIG');
//ubscriptions.push('Maroon5VEVO');
//subscriptions.push('tomstanton282');

app.listen(3000, () => {

  parseChannelJSON(subscriptions[0]);

});


function updateVideoDB(){
  // Bulk uploading - https://docs.mongodb.com/manual/reference/method/Bulk.find.updateOne/

  /*
    var testChannel = new db.Channel({
      name: 'test',
      id: 't3s7',
      lastUpdated: Date()
    });

    testChannel.save((err) => {
      if (err) throw err;
    })
  */
}


function parseChannelJSON(channel){
  var inspect = require('eyes').inspector({maxLength: true});

  getChannelJSON(channel).then(
    (result) => {
      let channelTitle = result.feed.title[0];
      let videos  = result.feed.entry;

      videos.forEach((video) => {
        metadata = {
          id: video.id[0].replace('yt:video:',''),
          title: video.title[0],
          description: video['media:group'][0]['media:description'],
          thumbnail: video['media:group'][0]['media:thumbnail'][0].$.url,
          uploaded: video.published[0],
          channelID: channelTitle
        }
      });
    }
  )

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
  return (string == '');
}


/*

Update subscriptions using Cron job every X minutes
List of channels(users subscribed to)
 -> get user feed list (title, video ID, description, release date)
    -> Download video [youtube-dl get downnload link]
        -> render video stream


NOTES & Links:
 NPM package for cron job behavior - https://www.npmjs.com/package/cron
 Channel RSS example - https://www.youtube.com/feeds/videos.xml?user=istarusIG
 JSON viewer - http://jsonviewer.stack.hu/
*/
