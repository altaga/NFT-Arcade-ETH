// Basic imports
import '../assets/main.css';
import '../assets/fontawesome.min.css'
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import usersData from './tools/usersData';
import VP from '../components/videoplayer';
import maticIcon from '../assets/matic-token.png';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { abi } from '../contracts/nftContract';
const Web3 = require('web3')
const dataweb3 = new Web3("https://speedy-nodes-nyc.moralis.io/9bf061a781e6175f3e78d615/polygon/mumbai");

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

function stringToLower(str) {
    return str.toLowerCase();
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

class Session extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            live: "",
            nft: [],
            prices: [],
            status: [],
            recordNumber: [],
        }
        this.data = getUserData(this.props.match.params.pub)
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
        this.url_params = new URLSearchParams(this.props.location.search)
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
                }, () => {
                    let __this = _this;
                    _this.unirest('GET', 'https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/arcade-GetDB')
                        .headers({
                            'pubkey': _this.props.match.params.pub
                        })
                        .end((res) => {
                            if (res.error) throw new Error(res.error);
                            let temp = res.body
                            temp.map(item => {
                                item.Data = JSON.parse(item.Data)
                            });
                            let temp2 = []
                            let tempState = []
                            let tempPrice = []
                            let tempRecordNumber = []
                            for (let i = 0; i < temp.length; i++) {
                                if (temp[i].stream === __this.state.records[__this.url_params.get('id')].id) {
                                    temp2.push(temp[i])
                                    tempState.push(true)
                                    tempPrice.push("0")
                                    tempRecordNumber.push(i)
                                }
                            }
                            console.log(temp2);
                            __this.setState({
                                nft: temp2,
                                status: tempState,
                                prices: tempPrice,
                                recordNumber: tempRecordNumber
                            }, () => {
                                let ___this = __this;
                                for (let i = 0; i < ___this.state.nft.length; i++) {
                                    ___this.updatePrice(___this.state.nft[i]["Contract"], i)
                                }
                            })
                        });
                })
            });
        checkLive(this.data.streamURL).then(live => {
            _this.setState({
                live: live
            });
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
            temp[id] = parseFloat(dataweb3.utils.fromWei(price, 'ether'));
            this.setState({
                prices: temp
            });
        });
    }

    render() {
        return (
            <div className="App" style={{ overflowX: "hidden" }}>
                <Header />
                <div className="body-style2" id="body-style">
                    {
                        this.state.records.length > 0 &&
                        <div style={{ marginTop: "2vh" }} className='center'>
                            <h1>Stream ({new Date(this.state.records[this.url_params.get('id')].createdAt).toLocaleString()})</h1>
                        </div>
                    }
                    <div className='center'>
                        {
                            this.state.records.length > 0 &&
                            <VP
                                src={this.state.records[this.url_params.get('id')].recordingUrl}
                                poster={this.data.logo}
                                width="720"
                                height="480"
                            />
                        }
                    </div>
                    <div style={{ marginTop: "2vh", marginBottom: "2vh" }} className="myhr2" />
                    <div style={{ marginBottom: "2vh" }} className='center'>
                        <h1>NFT's Collection</h1>
                    </div>
                    <div className="flexbox-style">
                        {
                            this.state.nft.map((element, index) => {
                                return (
                                    <Card key={index + "element"} style={{ width: "16vw", height: "40vh", margin: "6px", backgroundColor: "#00c6c6" }}>
                                        <div style={{ opacity: "100%", textAlign: "center", paddingTop: "10px" }} >
                                            <video style={{ borderRadius: "20px", border: "2px rgb(210, 9, 195) solid" }} width={window.innerWidth * .14} src={element.Url} />
                                        </div>
                                        <CardBody>
                                            <CardSubtitle style={{ paddingBottom: "6px" }} className="mb-2 text-muted">
                                                <div style={{color:"white"}}>
                                                    {element.Data.name}
                                                </div>
                                            </CardSubtitle>
                                            <CardSubtitle style={{ paddingBottom: "6px" }} tag="h5" className="mb-2 text-muted">
                                                <div className="flexbox-style" style={{ color: "white" }}>
                                                    <div>
                                                        {"Price:"}
                                                        <>&nbsp;</>
                                                    </div>
                                                    <div>
                                                        {
                                                            this.state.prices[index] === "0" ?
                                                                "....."
                                                                :
                                                                this.state.prices[index]
                                                        }
                                                    </div>
                                                    <>&nbsp;</>
                                                    <img src={maticIcon} style={{ width: "30px" }} />
                                                    <p />
                                                    {
                                                        !this.state.status[index] &&
                                                        <div style={{ color: "red" }}>
                                                            <>&nbsp;</>
                                                            Sold
                                                        </div>
                                                    }
                                                </div>
                                            </CardSubtitle>
                                            <div style={{ fontSize: "1rem" }}>
                                                {element.Data.attributes[0].game}
                                            </div>
                                            <div className="flexbox-style">
                                                <div style={{ position: "absolute", bottom: "2vh" }}>
                                                    <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }} onClick={() => {
                                                        window.open(`/nft/${element.PubKey}?id=${this.state.recordNumber[index]}`, "_blank");
                                                    }}>Open NFT</Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                );
                            })
                        }
                    </div>
                    <br />
                </div>
            </div>
        );
    }
}

export default Session;