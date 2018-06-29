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
    this.update();
  }


  componentDidUpdate(){
    this.update();
  }


  update() {
    fetch('/channels')
      .then((response) => response.json())
      .then(channels => this.setState({ channels: channels }));
  }


  render() {
    let channels = this.state.channels;

    if (Object.keys(channels).length !== 0) {
      return (
        <div>
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



class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: {},
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.channel !== prevProps.channel) {
      console.log(this.props.channel.id);
      
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
    this.props.update(); // call Parent component(<Channels>) to get new channels data
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


class recentVideos extends Component{
  constructor(){
    super();
    this.date = new Date();
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
        <Youtube videoId={this.state.playing}/>
        <h2>Recent: </h2>
        <recentVideos/>
        <h2>Channel: </h2>
        <Channels setChannel={(channel) => this.setState({ channel: channel })} />
        <h2>Videos: </h2>
        <Video setVideo={(videoID) => this.setState({ playing: videoID })}
               channel={this.state.channel}/>
      </div>
    );
  }
}

export default App;
