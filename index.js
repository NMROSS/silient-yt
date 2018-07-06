const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const channels = require('./model/channel.js');
const youtube = require('./controller/youtube.js');
const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('', routes);

app.listen(3000, () => {
    setInterval(syncSubscriptions, 30 * 60 * 1000);
});

function syncSubscriptions() {
    channels.getChannels()
        .then((result) => result.map(channel => youtube.addVideosDB(channel.id))
        );
    console.log('Updating youtube subsciptions');
    
}