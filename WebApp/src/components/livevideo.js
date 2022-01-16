import React, { Component } from 'react';
import VP from './tools/videoplayer';
import offline from '../Assets/offline.gif';
import './tools/mycss.css';

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

class LVP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      live: false
    }
  }

  componentDidMount() {
    setInterval(() => {
      fetch(this.props.src, requestOptions)
        .then(response => response.status)
        .then(result => {
          console.log(result);
          if (result === 404 || result === 503) {
            this.setState({
              live: false
            });
          }
          else {
            this.setState({
              live: true
            })
          }
        })
        .catch(error => console.log('error', error));
    }, 5000);
  }

  render() {
    return (
      <div className="container">
        <div className="stack-top">
          <VP
            src={this.props.src}
            poster={this.props.src}
            width="720"
            height="480"
          />
        </div>
        <div hidden={this.state.live} className="box">
          <img
            width="720"
            height="480"
            src={offline} 
            alt="offline" />
        </div>
      </div>
    );
  }
}
export default LVP;