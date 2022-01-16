import React, { Component } from 'react';
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import '../assets/main.css';
import { connect } from 'react-redux';
import { set_contracturl_action } from "../redux/actions/syncActions/updateContractUrlaction"
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import autoBind from 'react-autobind';
import SimpleReactFileUpload from '../components/Upload';
import Header from '../components/header';
import { Grid } from 'react-loading-icons';
import usersData from '../pages/tools/usersData';
import { abi, bytecode, content } from '../contracts/nftContract';
import Web3 from 'web3';
import VP from '../components/videoplayer';

var unitMap = {
    'wei': '1',
    'kwei': '1000',
    'ada': '1000',
    'femtoether': '1000',
    'mwei': '1000000',
    'babbage': '1000000',
    'picoether': '1000000',
    'gwei': '1000000000',
    'shannon': '1000000000',
    'nanoether': '1000000000',
    'nano': '1000000000',
    'szabo': '1000000000000',
    'microether': '1000000000000',
    'micro': '1000000000000',
    'finney': '1000000000000000',
    'milliether': '1000000000000000',
    'milli': '1000000000000000',
    'ether': '1000000000000000000',
    'kether': '1000000000000000000000',
    'grand': '1000000000000000000000',
    'einstein': '1000000000000000000000',
    'mether': '1000000000000000000000000',
    'gether': '1000000000000000000000000000',
    'tether': '1000000000000000000000000000000'
};

const streamers = {
    'Disguise Taco': '0x2E7EE23c25f550924f0EEA127CaBdaE791fA555e',
    'Auron Pause': '0xa76Dcef44C91233b93F718ad105122F19f0A5fa3',
    'Flawler': '0x05A3451c48422DEa29Ab913F69268904AF27E4e2',
    'CartonPotato': '0xFF8F5406C9494883182059Baa6a2C5989fF81d48',
    'Thiago one': '0x2aBd020136933378F70b11DC68Eb032Bb2ebBbf0',
    'Morenus': '0x0eDF6A0593F168C633E097d8D98F9E284e02B5Da',
    'Pokimanolo': '0x57De467d5019C2eDDF415052fDe0ee5f37D56f54',
    'Samurai': '0xA8c35efb8E8a99d9D3931C5F191fFFD927e90A32',
    'Solo Manco Only': '0x1C00a9FEbBf6fF5aa2c16E91a4D57917147Bb626',
}

function getUserData(publicKey) {
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].publicKey === publicKey) {
            return usersData[i];
        }
    }
}

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finalUrl: '',
            loading: false,
            price: 0,
            currency: 'wei',
            mintButton: true,
            nftNumber: 0,
            nftaws: "",
            stream: "",
            streamList: [],
            streamd: `Example Stream`,
            previewUrl: "",
            url: "",
            start: "00:00:00",
            end: "00:01:00",
        }
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.my_pubkey.pubkey !== "" && JSON.stringify(prevProps.my_pubkey.pubkey) !== JSON.stringify(this.props.my_pubkey.pubkey)) {
            this.props.set_activetab_action(1);
        }
    }

    checkNFTnumber() {
        this.unirest('GET', 'https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/arcade-GetDB')
            .headers({
                'pubkey': this.state.streamer
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                this.setState({
                    nftNumber: res.body.length
                });
            });
    }

    componentWillUnmount() {

    }

    createContract() {
        this.setState({ loading: true });
        const deploy_contract = new this.web3.eth.Contract(abi());
        // Function Parameter
        let payload = {
            data: "0x" + bytecode()
        }

        let parameter = {
            from: this.props.my_pubkey.pubkey
        }

        // Function Call
        deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        }).on('confirmation', () => { }).then((newContractInstance) => {
            this.props.set_contracturl_action(newContractInstance.options.address);
            this.setState({ loading: false });
            this.props.set_activetab_action(2);
            setTimeout(() => this.props.set_activetab_action(3), 5000);
        });
    }

    mintNFT() {
        this.setState({ loading: true });
        const mint_contract = new this.web3.eth.Contract(abi(), this.props.my_contracturl.contracturl, { from: this.props.my_pubkey.pubkey });
        mint_contract.methods.mintNFT(this.props.my_ipfslink.ipfslink.nft, (this.state.price * unitMap[this.state.currency]).toString()).send().on('transactionHash', (hash) => {
            this.unirest('GET', 'https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/arcade-PutDB')
                .headers({
                    'pubkey': this.state.streamer,
                    'data': JSON.stringify(this.props.my_nft.nft),
                    'etherscan': `https://mumbai.polygonscan.com/tx/${hash}`,
                    'contract': this.props.my_contracturl.contracturl,
                    'aws': this.props.my_ipfslink.ipfslink.nftaws,
                    'stream': this.state.stream
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    this.setState({
                        loading: false,
                        finalUrl: `https://mumbai.polygonscan.com/tx/${hash}`
                    });
                });
        }).on('confirmation', () => { this.props.set_activetab_action(6) })
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="bodyUp-style" style={{ fontSize: "1.5rem" }} id="body-style">
                    <div>
                        {
                            this.props.my_activetab.activetab === 0 &&
                            <div style={{ paddingTop: "20vh" }}>
                                <Grid fill="black" />
                                <br />
                                <br />
                                <div>
                                    Waiting for MetaMask to connect...
                                </div>
                                <br />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 1 &&
                            <div style={{ paddingTop: "5vh" }}>
                                <div>
                                    Deploy NFT contract on Polygon network.
                                </div>
                                <textarea id="upload1" style={{ fontSize: "1rem", width: "60vw", height: "40vh", overflowY: "scroll", overflowX: "scroll", resize: "none" }} value={content()} readOnly />
                                <p />
                                <Button id="button-upload1" color="primary" style={{ fontSize: "1.5rem", borderRadius: "25px", background: ` #d209c3` }} onClick={() => {
                                    document.getElementById('button-upload1').disabled = true;
                                    document.getElementById('button-upload1').innerHTML = 'Deploying...';
                                    this.createContract();
                                }}>
                                    Deploy Contract
                                </Button>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 2 &&
                            <div style={{ paddingTop: "20vh" }}>
                                <Grid fill="white" />
                                <br />
                                <br />
                                <div>
                                    Waiting for Polygon network
                                </div>
                                <br />
                                <div>
                                    <a href={`https://mumbai.polygonscan.com/address/${this.props.my_contracturl.contracturl}`} target="_blank" rel="noopener noreferrer">
                                        {this.props.my_contracturl.contracturl}
                                    </a>
                                </div>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 3 &&
                            <div>
                                <h2>
                                    NFT File Creator
                                </h2>
                                <div className="flexbox-style3" >
                                    <div style={{ paddingTop: "1vh", width: "40vw" }}>
                                        <FormGroup>
                                            <Label for="">Streamer</Label>
                                            <Input defaultValue={"Select Streamer"} type="select" name="text" placeholder="Diago" onChange={(event) => {
                                                this.setState({
                                                    streamer: streamers[event.target.value]
                                                })
                                                let _this = this;
                                                this.unirest('GET', 'https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/livepeer-get-streamer-records')
                                                    .headers({
                                                        'streamerid': `${getUserData(streamers[event.target.value]).streamID}`
                                                    })
                                                    .end(function (res) {
                                                        if (res.error) throw new Error(res.error);
                                                        _this.setState({
                                                            streamList: JSON.parse(res.body)
                                                        })
                                                    });
                                            }}>
                                                <option disabled value={"Select Streamer"}>Select Streamer</option>
                                                {Object.keys(streamers).map((key, index) => {
                                                    return <option key={index} value={key}>{key}</option>
                                                })}
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="">Stream</Label>
                                            <Input defaultValue={"Select Streamer"} type="select" name="text" placeholder="Diago" onChange={(event) => {
                                                console.log(event.target.value)
                                                this.setState({
                                                    stream: JSON.parse(event.target.value).id,
                                                    previewUrl: JSON.parse(event.target.value).recordingUrl,
                                                    url: JSON.parse(event.target.value).mp4Url
                                                })
                                            }}>
                                                <option disabled value={"Select Streamer"}>Select Stream</option>
                                                {
                                                    this.state.streamList.map((key, index) => {
                                                        return <option key={index} value={JSON.stringify(key)}>{new Date(key.createdAt).toLocaleString()}</option>
                                                    })
                                                }
                                            </Input>
                                        </FormGroup>
                                    </div>
                                </div>
                                {
                                    this.state.previewUrl !== "" &&
                                    <div>
                                        <div className='center'>
                                            <VP
                                                src={this.state.previewUrl}
                                                width="720"
                                                height="480"
                                            />
                                        </div>
                                        <div className='center'>
                                            <FormGroup style={{ width: "50vw" }}>
                                                <Row>
                                                    <Col>
                                                        <Label for="">Start</Label>
                                                        <Input defaultValue={"00:00:00"} placeholder='00:00:00' onChange={(event) => {
                                                            this.setState({
                                                                start: event.target.value
                                                            })
                                                        }}>
                                                        </Input>
                                                    </Col>
                                                    <Col>
                                                        <Label for="">End</Label>
                                                        <Input defaultValue={"00:01:00"} placeholder='00:01:00' onChange={(event) => {
                                                            this.setState({
                                                                end: event.target.value
                                                            })
                                                        }}>
                                                        </Input>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </div>
                                        <br />
                                        <div className='center'>
                                            <div style={{ width: "50vw" }}>
                                                <Row>
                                                    <Col>
                                                        <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }}> <a style={{color:"white", textDecoration:"none"}} href={`https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/download-nft-file?url=${this.state.url}&start=${this.state.start}&end=${this.state.end}`}>
                                                            Download
                                                        </a></Button>
                                                    </Col>
                                                    <Col>
                                                        <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #d209c3` }} onClick={() => { 
                                                            this.props.set_activetab_action(4) 
                                                            this.checkNFTnumber()
                                                            }}>
                                                            Continue
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 4 &&
                            <div style={{ paddingTop: "12vh" }}>
                                <SimpleReactFileUpload streamer={this.state.streamer} stream={this.state.stream} callback={this.callback} url={"https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/arcade-NFTupload"} />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 5 &&
                            <div className="flexbox-style3">
                                <div style={{ paddingTop: "2vh" }}>
                                    <p />
                                    <video height="256" src={this.props.my_ipfslink.ipfslink.nftaws} poster={this.props.my_ipfslink.ipfslink.nftawsimage} controls />
                                    <p />
                                    <Input type="number" name="price" placeholder="Matic price" onChange={(event) => {
                                        if (event.target.value * parseInt(unitMap[this.state.currency]) >= 1) {
                                            this.setState({ mintButton: false });
                                            this.setState({ price: event.target.value })
                                        } else {
                                            this.setState({ mintButton: true });
                                        }
                                    }} />
                                    <Input defaultValue="wei" type="select" id="selectorether" name="selector" onChange={(event) => {
                                        this.setState({ currency: event.target.value })
                                    }}>
                                        <option value="wei" >Matic Wei</option>
                                        <option value="gwei">Matic Gwei</option>
                                        <option value="finney">Matic Finney</option>
                                        <option value="ether">Matic</option>
                                    </Input>
                                    {`Matic value: ${this.web3.utils.fromWei((this.state.price * parseInt(unitMap[this.state.currency])).toString(), "ether")}`}
                                    <p />
                                    <Button disabled={this.state.mintButton} id="upload3" color="primary" style={{ fontSize: "1.5rem", borderRadius: "25px", background: ` #d209c3` }} onClick={() => {
                                        this.setState({ mintButton: true });
                                        document.getElementById('upload3').innerHTML = 'Minting...';
                                        this.mintNFT();
                                    }}>
                                        Mint this NFT
                                    </Button>
                                </div>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 6 &&
                            <>
                                <div style={{ paddingTop: "2vh" }}>
                                    <video height="400" src={this.props.my_ipfslink.ipfslink.nftaws} poster={this.props.my_ipfslink.ipfslink.nftawsimage} controls />
                                </div>
                                <div style={{ paddingTop: "3vh" }}>
                                    <Button style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem", borderRight: "1px solid black", background: ` #d209c3` }} onClick={() => window.open(this.state.finalUrl, "_blank")}>View on Polygon Scan</Button>
                                    <Button style={{ borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #d209c3` }} onClick={() => window.open(`/nft/${this.state.streamer}?id=${this.state.nftNumber}`, "_blank")}>View on Marketplace</Button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_contracturl_action,
    set_pubkey_action,
    set_activetab_action
}

const mapStateToProps = (state) => {
    return {
        my_contracturl: state.my_contracturl,
        my_pubkey: state.my_pubkey,
        my_ipfslink: state.my_ipfslink,
        my_activetab: state.my_activetab,
        my_nft: state.my_nft
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);