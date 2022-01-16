import React from 'react'
import { post } from 'axios';
import { Button, FormGroup, Input, Label } from 'reactstrap'
import { connect } from 'react-redux'
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import { set_nft_action } from '../redux/actions/syncActions/setNFTaction';
import { set_ipfslink_action } from "../redux/actions/syncActions/updateIPFSaction"
import { abi } from '../contracts/nftContract';
import autoBind from 'react-autobind';
import usersData from '../pages/tools/usersData';
const Web3 = require('web3')

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

class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      description: 'Example Description',
      external_url: 'https://main.d3h8pyav6x8msw.amplifyapp.com/',
      name: ' Example NFT',
      game: `Example Game`,
      streamList: [],
    }
    autoBind(this);
    this.unirest = require('unirest');
    this.web3 = new Web3(window.ethereum);
  }

  onFormSubmit(e) {
    this.fileUpload(this.state.file).then((response) => {
      console.log(response)
      const mint_contract = new this.web3.eth.Contract(abi(), this.props.my_contracturl.contracturl, { from: this.props.my_pubkey.pubkey });
      mint_contract.methods.setStreamer(this.props.streamer).send().on('transactionHash', (hash) => {
        console.log(hash)
      }).on('confirmation', () => {
        this.props.set_activetab_action(5)
        this.props.set_nft_action(response.data.metadata)
        this.props.set_ipfslink_action(response.data)
      })
    })
  }

  onFileChange(e) {
    console.log(e.target.files[0])
    this.setState({ file: e.target.files[0] })
  }

  fileUpload(file) {
    const url = this.props.url;
    const formData = new FormData();
    formData.append('nft', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'name': this.state.name,
        'external_url': this.state.external_url,
        'description': this.state.description.replace('"', "'"),
        'game': this.state.game,
        'streamer': this.props.streamer,
        'stream': this.props.stream
      }
    }
    console.log(config)
    return post(url, formData, config)
  }

  render() {
    return (
      <div className="flexbox-style3" style={{ marginTop: "-100px" }}>
        <form>
          <p />
          <FormGroup>
            <Label for="">NFT Name</Label>
            <Input type="text" name="text" placeholder="Super NFT Name" onChange={(event) => {
              this.setState({ name: event.target.value })
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="">Description</Label>
            <Input type="text" name="text" placeholder="Super NFT Description" onChange={(event) => {
              this.setState({ description: event.target.value })
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="">Game Name</Label>
            <Input type="text" name="text" placeholder="Mortal Street Fighter X" onChange={(event) => {
              this.setState({ game: event.target.value })
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="">Game Url</Label>
            <Input type="text" name="text" placeholder="http://example.com" onChange={(event) => {
              this.setState({ external_url: event.target.value })
            }} />
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">NFT Video</Label>
            <p />
            <Input type="file" onChange={this.onFileChange} />
            <p />
            <Button id="upload2" style={{ width: "200px", borderRadius: "25px", fontSize: "1.5rem", background: ` #d209c3` }} color="primary" type="submit" onClick={() => {
              document.getElementById("upload2").innerHTML = "Uploading..."
              document.getElementById("upload2").disabled = true
              this.onFormSubmit()
            }}>Upload</Button>
          </FormGroup>
          <p />
        </form>
      </div>
    )
  }
}

const mapDispatchToProps =
{
  set_activetab_action,
  set_nft_action,
  set_ipfslink_action
}

const mapStateToProps = (state) => {
  return {
    my_pubkey: state.my_pubkey,
    my_contracturl: state.my_contracturl,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleReactFileUpload);