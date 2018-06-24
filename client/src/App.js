import React, { Component } from 'react';
import './App.css';
import Youtube from 'react-youtube';


class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: {},
    };
  }

  componentDidMount() {
    fetch('/channels')
      .then((response) => response.json())
      .then(channels => this.setState({ channels: channels }));
  }

  render() {
    let channels = this.state.channels;

    if (Object.keys(channels).length !== 0) {
      return (
        <ul>
          {channels.map(channel => (
            <li onClick={() => this.props.setChannel(channel)}>{channel}</li>
          ))}
        </ul>
      )
    }
    return <h3>Error getting channel list</h3>
  }
}


class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: {},
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.channel !== prevProps.channel) {

      let channel = '/channel/' + this.props.channel;

      fetch(channel)
        .then((response) => response.json())
        .then(videos => this.setState({ videos: videos }));
    }
  }

  render() {

    let videos = this.state.videos;

    // check if we have received video json (We may have not received API response) 
    if (Object.keys(videos).length !== 0) {
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
  constructor() {
    super();
    this.state = {
      playing: '',
      channel: '',
    };

  }

  render() {

    return (
      <div className="App">
        <Youtube videoId={this.state.playing} />

        <Channels setChannel={(channel) => this.setState({
          channel: channel
        })} />

        <Video setVideo={(videoID) => this.setState({
          playing: videoID
        })}
          channel={this.state.channel}
        />
      </div>
    );
  }
}

export default App;
