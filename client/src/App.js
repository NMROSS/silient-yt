import React, { Component } from 'react';
import './App.css';
import Youtube from 'react-youtube';

class VideoList extends Component{
  constructor(props){
    super(props);
    this.state = {
      videos : {},
    }
  }

  componentDidMount() {
    fetch('/UCqiYX6cqxQI9CqhH_kvHeOw')
      .then((response) => response.json())
      .then(videos => this.setState({ videos: videos }));
  }


  render() {
    let videos = this.state.videos;
    // check if we have received json 
    if (videos[0]) {
      return (<ul>
        {videos.map((video) => (
        <li onClick={() => this.props.setVideo(video.id)}>{video.title}</li>
        )
      )}
      </ul>)
    }
    return (<h3>Error Loading Video Subscriptions</h3>)
  }
}


class App extends Component {
  constructor(){
    super();
    this.state = {
      playing: '',
    };

  }

  render() {
    return (
      <div className="App"> 
          <Youtube videoId={this.state.playing}/>
          {/*<ReactPlayer url={this.state.playing} controls='true' playing />*/}
          <VideoList setVideo={(videoID) => this.setState({ 
            playing : videoID
          })}/>
      </div>
    );
  }
}

export default App;
