const express = require('express');
const request = require('request');
const parseXML = require('xml2js').parseString;
const app = express();

var subscriptions = [];
subscriptions.push('istarusIG');
subscriptions.push('Maroon5VEVO');

app.listen(3000, () => {
  var inspect = require('eyes').inspector({maxLength: true});

  getChannels();

});

function getChannels(){
  subscriptions.forEach((video) => {
    getChannelJSON(video).then(
        (result) => {
          console.log(inspect(result.feed.entry[0]));
        }
      )
    }
  );
}

function addChannel(channel){
  if (channel == '') return; // TODO throw error

  // check if channel already exists
  if (subscriptions.find((x) => x == channel)){
    return;
  }
  subscriptions.push(channel);
}


function getChannelJSON(channel){
  return new Promise(
    (resolve, reject) => {
      let feedURL = `https://www.youtube.com/feeds/videos.xml?user=${channel}`;

      // TODO - Only request if newer version of feed available to reduce load on youtube and quicker checking.
      request({uri : feedURL, gzip : true}, function(error, response, body) {
        parseXML(body, (err, result)=>{
          resolve(result);
        });
      });
    });
  }


/*

Update subscriptions using Cron job every X minutes
List of channels(users subscribed to)
 -> get user feed list (title, video ID, description, release date)
    -> Download video [youtube-dl get downnload link]
        -> render video stream

NPM package for cron job behavior - https://www.npmjs.com/package/cron
Channel Rss example - https://www.youtube.com/feeds/videos.xml?user=istarusIG

*/
