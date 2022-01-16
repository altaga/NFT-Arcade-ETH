// Basic imports
import '../assets/main.css';
import { Component } from 'react';
import autoBind from 'react-autobind';
import Footer from '../components/footer';
import Header from '../components/header';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Col, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { abi } from '../contracts/nftContract';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import maticIcon from '../assets/matic-token.png'
import { FaFileInvoiceDollar, FaImage, FaPalette, FaUpload } from 'react-icons/fa';
import usersData from './tools/usersData';
const Web3 = require('web3')
const dataweb3 = new Web3("https://speedy-nodes-nyc.moralis.io/9bf061a781e6175f3e78d615/polygon/mumbai");

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

async function checkLive(streamURL) {
  let response = await fetch(streamURL, requestOptions);
  return response.status === 200 ? true : false;
}

function shuffle(inArray) {
  let tempArray = inArray;
  for (let i = tempArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray;
}

function searchInJSON(json, searchTerm) {
  let result = [];
  let avoid = [];
  for (let i = 0; i < json.length; i++) {
    
    if (JSON.parse(json[i].Data).name.toLowerCase().includes(searchTerm.toLowerCase())) {
      avoid.push(i);
      result.push(json[i]);
    }
  }
  for (let i = 0; i < json.length; i++) {
    if (JSON.parse(json[i].Data).attributes[0].game.toLowerCase().includes(searchTerm.toLowerCase()) && avoid.indexOf(i) === -1) {
      result.push(json[i]);
    }
  }
  return result;
}

function getUserData(username) {
  for (let i = 0; i < usersData.length; i++) {
    if (usersData[i].name === username) {
      return usersData[i];
    }
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      artist: {},
      prices: [],
      status: [],
      search: "",
      searchElements: [],
      searchResults: [],
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
      let temp = JSON.parse(res.body).map(x => getUserData(x.name))
      _this.setState({
         streamers: temp
      });
      temp.map((x, index) => {
        console.log(index);
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

  updatePrice(contract, id) {
    const mint_contract = new dataweb3.eth.Contract(abi(), contract);
    mint_contract.methods.flag().call().then(status => {
      let temp = this.state.status;
      temp[id] = status;
      this.setState({
        status: temp
      });
    });
    mint_contract.methods.price().call().then(price => {
      let temp = this.state.prices;
      temp[id] = price;
      this.setState({
        prices: temp
      });
    });
  }

  render() {
    return (
      <div className="App" style={{ overflowX: "hidden" }}>
        <Header />
        <div className="body-style" id="body-style" style={{ overflowX: "hidden", overflowY: "hidden" }}>
          <div>
            <Row style={{ paddingBottom: "13vh" }}>
              <Col style={{ paddingTop: "14vh", paddingLeft: "12vw" }}>
                <h1 style={{ fontWeight: "bold", fontSize: "4rem" }}>OWN<p /> streaming’s BEST <p /> moments</h1>
                <h5>
                  <p />Collect and trade great moments 
                  <p />from your favourite creators.
                </h5>
                <br />
                <Row>
                  <Col>
                    <div style={{ width: "90%", paddingLeft: "5%" }} className="flexbox-style">
                      <Input onClick={()=>{
                        this.setState({
                          searchResults:[],
                        })
                      }} onChange={(event) => {
                        this.setState({
                          search: event.target.value
                        });
                      }} style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem" }} type="text"
                        placeholder="   Search Creator or Content" />
                      <Button
                        onClick={() => {
                          console.log(searchInJSON(this.state.searchElements, this.state.search))
                          this.setState({
                            searchResults: searchInJSON(this.state.searchElements, this.state.search)
                          });
                        }}
                        style={{ width: "200px", borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: `#d209c3` }}>Search</Button>
                    </div>
                    <div style={{height:"20px"}}>
                    {
                      this.state.searchResults.length > 0 &&
                      <ListGroup style={{paddingLeft:"8%",overflowY:"scroll",height:"18vh",width:"67%"}}>
                        {
                          this.state.searchResults.map((element) => {
                            return (
                              <ListGroupItem style={{textAlign:"justify"}}>
                                <a className="nostyle" href={`/nft/${element.PubKey}?id=${element.Counter}`}>
                                {
                                  "NFT: " + JSON.parse(element.Data).name + ", Game: "+ JSON.parse(element.Data).attributes[0].game
                                }
                                </a>
                              </ListGroupItem>
                            )
                          })
                        }
                      </ListGroup>
                    }
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                  <div className="background-images"/>
              </Col>
            </Row>
            <br />
            <div className="myhr2" />
            <div style={{ paddingTop: "4vh" }}>
              <h1>
                Exclusives from The Arcade
              </h1>
            </div>
            <br />
            <div className="flexbox-style">
              {
                this.state.streamers.map((data, index) => {
                  if (index < 3) {
                    return (
                      <div key={"element" + index} style={{ margin: "10px", height: "74vh" }}>
                        <Card id={"cards" + index} style={{ width: "20vw", height: "74vh", backgroundColor:"#00c6c6" }}>
                          <div style={{ opacity: "100%", textAlign: "center", paddingTop: "10px" }} >
                            <img width= "250px" height="250px" style={{borderRadius:"50px", border:"2px rgb(210, 9, 195) solid"}} src={data.logo} />
                          </div>
                          <br />
                          <CardBody style={{WebkitTextStroke:"0.2px black"}}>
                            <CardTitle tag="h5">{data.name}</CardTitle>
                            <br />
                            <CardSubtitle tag="h3" className="mb-2 text-muted">
                              <div className="flexbox-style" style={{color:"white"}}>
                                {
                                  this.state.live[index] ?
                                  <span style={{color:"green"}}>LIVE</span>
                                  :
                                  <span style={{color:"red"}}>OFFLINE</span>
                                }
                              </div>
                            </CardSubtitle>
                            <br />
                            <div style={{ overflowY: "hidden", height: "100%", fontSize:"1.3rem" }}>
                              <CardText >
                                {
                                  data.description.length > 150 ?
                                  data.description.substring(0, 150) + "..." :
                                  data.description
                                }
                              </CardText>
                            </div>
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
                      </div>
                    )
                  }
                  else {
                    return null
                  }
                })
              }
            </div>
            <br />
            <br />
            <div className="myhr2" />
            <div style={{ paddingTop: "4vh" }}>
              <div>
                <h1>
                  Create and sell your NFTs
                </h1>
              </div>
              <Row style={{ padding: "10vh 4vh 4vh 4vh" }}>
                <Col>
                  <div>
                    <FaImage className="fa-gradient1" />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bolder", paddingTop: "2vh", paddingBottom: "2vh" }}>
                    Connect to your wallet
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    Set up your wallet of choice. Link your NFT profile by clicking the wallet icon on the top right corner. Learn more in the wallets section.
                  </div>
                </Col>
               
                <Col>
                  <div>
                    <FaUpload className="fa-gradient3" />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bolder", paddingTop: "2vh", paddingBottom: "2vh" }}>
                    Upload your content
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                  Create your creator profile, Upload your descriptions, upload content you use to work with.
                  </div>
                </Col>
                <Col>
                  <div>
                    <FaFileInvoiceDollar className="fa-gradient4" />
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bolder", paddingTop: "2vh", paddingBottom: "2vh" }}>
                    Sell your Content
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                  Sell and trade 15 second videos of your favourite moments. You choose how you want to sell your NFTs.
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="myhr2" />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Main;