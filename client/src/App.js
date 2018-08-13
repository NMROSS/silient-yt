import React, { Component } from 'react';
import './App.css';
import Youtube from 'react-youtube';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: {},
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.channel !== prevProps.channel) {
      
      let channel = '/channel/' + this.props.channel.id;

      fetch(channel)
        .then((response) => response.json())
        .then(videos => this.setState({ videos: videos }));
    }
  }

  render() {

    let videos = this.state.videos;

    // check if we have received video json (We may have not received API response) 
    if (Object.keys(videos).length !== 0) {
      return (
        <div>
          <h2>Videos: </h2>
          <ul>
            {videos.map((video) => (
              <li onClick={() => this.props.setVideo(video.id)}>{video.title}</li>
            )
            )}
          </ul>
        </div>)
    }
    return (<h3>Error Loading Video Subscriptions</h3>)
  }
}


class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: {},
    };
  }


  render() {
    let channels = this.props.channels;

    if (Object.keys(channels).length !== 0) {
      return (
        <div id="channels">
        <h2>Channel: </h2>
          <ul>
            {channels.map(channel => (
              <li onClick={() => this.props.setChannel(channel)}>{channel.name}</li>
            ))}
          </ul>
          <CreateChannel update={this.update}/>
        </div>
      )
    }
    return <h3>Error getting channel list</h3>
  }
}


class CreateChannel extends Component{
  constructor(props){
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
 
    this.state = {
      channel : '',
    }
  }

  handleChange(event){
     this.setState({channel : event.target.value});
  }
    
  handleClick(){
    fetch('/channel/new', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ channel : this.state.channel })
    });
    this.setState({channel : ''});
  }

  render() {
    return (
      <div>
        <input value={this.state.channel} onChange={this.handleChange} type="text"></input>
        <button onClick={this.handleClick}>Add</button>
      </div>
    ) 
  }
}


class RecentVideos extends Component{
  constructor(props){
    super();
    this.date = new Date();
    this.state = {
      recent : '',
    }
  }

  componentDidMount() {
    fetch('/channels/recent/3') // channel/recent/:days set to 3 days
      .then((res) => res.json())
      .then(recentVideos => this.setState({recent : recentVideos}) );
  }

  render() {
    let videos = this.state.recent;

    if (Object.keys(videos).length !== 0) {
      return (
        <div class="container">
          <h2>Recent: </h2>
          {videos.map((video) => (
            <div class="vid-thumb">
            <img class="thumbnail" src={`${video.thumbnail}`}/>
              <a onClick={() => this.props.setVideo(video.id)}>{video.title}</a>
          </div>
          ))}
        </div>
      )
    }
    return <h3>Error loading recent channels</h3>
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      playing  : '',
      channel  : '',
      channels : '',
    };  

    this.syncSubscriptions = this.syncSubscriptions.bind(this);
  }

  componentDidMount(){
    this.syncTimer();
  }

  //TODO use Socket.io for realtime updating (will fix addChannel delay)
  syncTimer(){
    this.syncSubscriptions();
    setInterval(this.syncSubscriptions, 0.5 * 60 * 1000); // 30 seconds
  }


  syncSubscriptions(){    
    fetch('/channels')
      .then((response) => response.json())
      .then((channels) => this.setState({ channels: channels}));
  }


  render() {  

    return (
      <div className="App">
        <Youtube videoId={this.state.playing}/>
        
        <RecentVideos setVideo={(videoID) => this.setState({ playing: videoID })}/>
        
        <Channels channels={this.state.channels} setChannel={(channel) => this.setState({ channel: channel })}/> 

        <Video setVideo={(videoID) => this.setState({ playing: videoID })}
               channel={this.state.channel}/>
               
      </div>
    );
  }
}

export default App;
