// Basic imports
import '../assets/main.css';
import '../assets/fontawesome.min.css'
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import usersData from './tools/usersData';
import VP from '../components/videoplayer';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Row } from 'reactstrap';
const Web3 = require('web3')
const dataweb3 = new Web3("https://speedy-nodes-nyc.moralis.io/9bf061a781e6175f3e78d615/polygon/mumbai");

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

function stringToLower(str) {
    return str.toLowerCase();
}

function getUserData(publicKey) {
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].publicKey === publicKey) {
            return usersData[i];
        }
    }
}

async function checkLive(streamURL) {
    let response = await fetch(streamURL, requestOptions);
    return response.status === 200 ? true : false;
}

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            live: "",
        }
        this.data = getUserData(this.props.match.params.pub)
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
    }

    async componentDidMount() {
        let _this = this;
        this.unirest('GET', 'https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/livepeer-get-streamer-records')
            .headers({
                'streamerid': `${this.data.streamID}`
            })
            .end(function (res) {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    records: JSON.parse(res.body)
                })
            });
        checkLive(this.data.streamURL).then(live => {
            _this.setState({
                live: live
            });
        });
    }

    render() {
        return (
            <div className="App" style={{ overflowX: "hidden" }}>
                <Header />
                <div className="body-style2" id="body-style">
                    <Row md="2">
                        <Col xs="5">
                            <div style={{ opacity: "100%", textAlign: "center", paddingTop: "50px" }} >
                                <img width="250px" height="250px" style={{ borderRadius: "50px", border: "2px rgb(210, 9, 195) solid" }} src={this.data.logo} />
                            </div>
                            <br />
                            <br />
                            <div style={{ overflowY: "hidden", height: "100%", fontSize: "1.3rem" }}>
                                <CardText >
                                    {
                                        this.data.description.length > 150 ?
                                            this.data.description.substring(0, 150) + "..." :
                                            this.data.description
                                    }
                                </CardText>
                            </div>
                        </Col>
                        <Col xs="7">
                            {
                                this.state.live ?
                                    <div className='center'>
                                        <h1>Live Stream</h1>
                                    </div> :
                                    <div className='center'>
                                        <h1>Last Stream</h1>
                                    </div>
                            }
                            <div className='center'>
                                {
                                    this.state.live === "" &&
                                    <div className="loader"></div>
                                }
                                {
                                    this.state.live === true &&
                                    <VP
                                        src={this.data.streamURL}
                                        poster={this.data.logo}
                                        width="720"
                                        height="480"
                                    />
                                }
                                {
                                    (this.state.live === false && this.state.records.length > 0) &&
                                    <VP
                                        src={this.state.records[0].recordingUrl}
                                        poster={this.data.logo}
                                        width="720"
                                        height="480"
                                    />
                                }
                            </div>
                        </Col>
                    </Row>
                    <div style={{ marginTop: "2vh", marginBottom: "2vh" }} className="myhr2" />
                    <div className="flexbox-style">
                        {
                            this.state.records.map((record, index) => {
                                if (record.recordingStatus === "ready") {
                                    console.log()
                                    return (
                                        <div id={"divelement" + index} key={"element" + index} style={{ margin: "10px", height: "20vh" }}>
                                            <Card id={"cards" + index} style={{ width: "18vw", height: "30vh", backgroundColor: "#00c6c6" }}>
                                                <div style={{ fontSize: "1.4rem" }}>
                                                    Recorded Stream
                                                </div>
                                                <p />
                                                <VP
                                                    src={record.recordingUrl}
                                                    poster={this.data.logo}
                                                    width={window.innerWidth * 0.178}
                                                    height={window.innerHeight * 0.4}
                                                />
                                                <div style={{ fontSize: "1.4rem" }}>
                                                    {new Date(record.createdAt).toLocaleString()}
                                                </div>
                                                <p />
                                                <div style={{ marginTop: "10px" }}>
                                                    <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }} onClick={() => {
                                                        window.open(`/session/${this.props.match.params.pub}?id=${index}`, "_blank");
                                                    }}>Open Stream</Button>
                                                </div>
                                                <br/>
                                            </Card>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <br />
                </div>
            </div>
        );
    }
}

export default Streamer;