import '../assets/main.css';
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import { abi } from '../contracts/nftContract';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import maticIcon from '../assets/matic-token.png';
import usersData from './tools/usersData';
const Web3 = require('web3')
const dataweb3 = new Web3("https://speedy-nodes-nyc.moralis.io/9bf061a781e6175f3e78d615/polygon/mumbai");

function sortByStreamerA(array) {
  return array.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}

function sortByStreamerD(array) {
  return array.sort((a, b) => {
    if (a.name > b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
    return 0;
  });
}

function parse(array) {
  try {
    let temp = JSON.parse(array).attributes[0].artist;
    return temp
  }
  catch (e) {
    console.log(array);
    return "error";
  }
}

function getUserData(username) {
  for (let i = 0; i < usersData.length; i++) {
    if (usersData[i].name === username) {
      return usersData[i];
    }
  }
}

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

async function checkLive(streamURL) {
  let response = await fetch(streamURL, requestOptions);
  return response.status === 200 ? true : false;
}

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      artist: {},
      prices: [],
      status: [],
      streamers: [],
      live: []
    }
    autoBind(this);
    this.unirest = require('unirest');
  }

  async componentDidMount() {
    let _this = this;
    this.unirest('GET', 'https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/livepeer-get-streamers')
      .end(function (res) {
        if (res.error) throw new Error(res.error);
        let myjson = JSON.parse(res.body);
        let temp = myjson.map(x => getUserData(x.name))
        _this.setState({
          streamers: temp
        });
        temp.map((x, index) => {
          checkLive(x.streamURL).then(live => {
            let temp2 = _this.state.live;
            temp2[index] = live;
            _this.setState({
              live: temp2
            });
          });
        })
      });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="body-style2" id="body-style" style={{ overflowX: "hidden" }}>
          <Row style={{ paddingLeft: "1vw", paddingTop: "1vh" }}>
            <Col xs="3" style={{ fontSize: "1.5rem", position: "fixed", paddingTop: "5.5px" }}>
              <Card style={{ backgroundColor: "#00c6c6" }}>
                <div id="artist-div" onClick={() => {
                  document.getElementById("artist-div2").hidden = !document.getElementById("artist-div2").hidden;
                }}>
                  Streamer
                  <br />
                </div>
                <div id="artist-div2">
                  <div style={{ paddingTop: "1vh", paddingBottom: "1vh" }}>
                    <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }} onClick={() => {
                      this.setState({
                        streamers: sortByStreamerA(this.state.streamers)
                      }, () => {
                        this.state.streamers.map((x, index) => {
                          checkLive(x.streamURL).then(live => {
                            let temp2 = this.state.live;
                            temp2[index] = live;
                            this.setState({
                              live: temp2
                            });
                          });
                        })
                      });
                    }}>
                      A to Z
                    </Button>
                  </div>
                  <div style={{ paddingTop: "1vh", paddingBottom: "2vh" }}>
                    <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }} onClick={() => {
                      this.setState({
                        streamers: sortByStreamerD(this.state.streamers)
                      }, () => {
                        this.state.streamers.map((x, index) => {
                          checkLive(x.streamURL).then(live => {
                            let temp2 = this.state.live;
                            temp2[index] = live;
                            this.setState({
                              live: temp2
                            });
                          });
                        })
                      });
                    }}>
                      Z to A
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col style={{ paddingLeft: "25vw" }}>
              <Row>
                {
                  this.state.streamers.map((data, index) => {
                    return (
                      <Card key={index + "element"} style={{ width: "16vw", height: "40vh", margin: "6px", backgroundColor: "#00c6c6" }}>
                        <div style={{ opacity: "100%", textAlign: "center", paddingTop: "10px" }} >
                          <img width="150px" height="150px" style={{ borderRadius: "50px", border: "2px rgb(210, 9, 195) solid" }} src={data.logo} />
                        </div>
                        <CardBody style={{ WebkitTextStroke: "0.2px black" }}>
                          <CardTitle tag="h5">{data.name}</CardTitle>
                          <CardSubtitle tag="h3" className="mb-2 text-muted">
                            <div className="flexbox-style" style={{ color: "white" }}>
                              {
                                this.state.live[index] ?
                                  <span style={{ color: "green" }}>LIVE</span>
                                  :
                                  <span style={{ color: "red" }}>OFFLINE</span>
                              }
                            </div>
                          </CardSubtitle>
                          <br />
                          <div className="flexbox-style">
                            <div style={{ position: "absolute", bottom: "2vh" }}>
                              <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }} onClick={() => {
                                window.open(`/streamer/${data.publicKey}`, "_blank");
                              }}>Open Channel</Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    )
                  })
                }
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Gallery;