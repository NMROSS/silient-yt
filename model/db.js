const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/silientyt');

var videoSchema =new Schema({
  id: String,
  title: String,
  description: String,
  thumbnail: String,
  uploaded: Date,
  channel: {
    name : String,
    id : String,
  }
});


var Video = mongoose.model('Video', videoSchema);


module.exports = {
    Video
}
