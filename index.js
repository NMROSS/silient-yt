const express = require('express');
const request = require('request');
const parseXML = require('xml2js').parseString;
const ytdl = require('ytdl-core');
const db = require('./model/db.js');

const app = express();

var subscriptions = [];

// test data
subscriptions.push('istarusIG');
subscriptions.push('Maroon5VEVO');
subscriptions.push('tomstanton282');

app.listen(3000, () => {

  //getVideos();

});

function getVideos(){
  var inspect = require('eyes').inspector({maxLength: true});

  subscriptions.forEach((video) => {
    getChannelJSON(video).then(
        (result) => {
          console.log(inspect(result));
        }
      )
    }
  );
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
