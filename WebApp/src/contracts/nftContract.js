exports.content = () =>{ return `
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract MyToken is ERC721URIStorage {
    
    address public owner;
    address public streamer;
    address public actualAddress;
    bool public flag = false;
    bool public flag2 = false;
    bool public flag3 = false;
    uint256 public price;
    uint256 public actualBid;
    string public tokenURI;
    address constant public theArcadeMarketplace = 0x662e332994Fd6a834eD965E6ED45643108eEef1c;
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _; // Close Modifier
    }

    modifier onlyStreamer{
        require(msg.sender == streamer);
        _; // Close Modifier
    }
    
    constructor() ERC721('NFT', 'MyNFT') {
        owner = msg.sender;
    }

    function setStreamer(address _streamer) public onlyOwner {
        require(false == flag2);
        streamer = _streamer;
        flag2=true;
    }

    function authorize() public onlyStreamer{
        flag3 = true;
    }
    
    function mintNFT(string memory _tokenURI, uint256 _price) public onlyOwner returns (uint256)
    {
        tokenURI = _tokenURI;
        _mint(owner, 1);
        _setTokenURI(1, tokenURI);
        price = _price;
        flag = true;
        return 1;
    }
    
    function bidUp() public payable {
        require(msg.value > actualBid);
        require(msg.value > price);
        require(flag == true);
        require(flag2 == true);
        require(flag3 == true);
        if(actualBid>0){
          payable(actualAddress).transfer(actualBid);  
        }
        actualAddress = msg.sender;
        actualBid = msg.value;
        price = msg.value;
    }
    
    function changePrice(uint256 _price) public onlyOwner {
        require(0 == actualBid);
        price = _price;
    }
    
    function activate() public onlyOwner{
        flag = true;
    }
    
    function finish() public onlyOwner payable {
        _transfer(owner, actualAddress, 1);
        actualBid = 0;
        flag = false;
        payable(theArcadeMarketplace).transfer(address(this).balance/50);
        payable(streamer).transfer(address(this).balance/50);
        payable(owner).transfer(address(this).balance); // send metis to the seller
        owner = actualAddress;
    }
}
`}

exports.abi = () => {
    return [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "activate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "actualAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "actualBid",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "authorize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "bidUp",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "changePrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "finish",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flag",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flag2",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flag3",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_tokenURI",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "mintNFT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "price",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_streamer",
                    "type": "address"
                }
            ],
            "name": "setStreamer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "streamer",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "theArcadeMarketplace",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
  };
  
  exports.bytecode = () => {
    return("60806040526000600960146101000a81548160ff0219169083151502179055506000600960156101000a81548160ff0219169083151502179055506000600960166101000a81548160ff0219169083151502179055503480156200006257600080fd5b506040518060400160405280600381526020017f4e465400000000000000000000000000000000000000000000000000000000008152506040518060400160405280600581526020017f4d794e46540000000000000000000000000000000000000000000000000000008152508160009080519060200190620000e79291906200014a565b508060019080519060200190620001009291906200014a565b50505033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506200025f565b8280546200015890620001fa565b90600052602060002090601f0160209004810192826200017c5760008555620001c8565b82601f106200019757805160ff1916838001178555620001c8565b82800160010185558215620001c8579182015b82811115620001c7578251825591602001919060010190620001aa565b5b509050620001d79190620001db565b5090565b5b80821115620001f6576000816000905550600101620001dc565b5090565b600060028204905060018216806200021357607f821691505b602082108114156200022a576200022962000230565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6137d7806200026f6000396000f3fe6080604052600436106101cd5760003560e01c80637f032c4f116100f7578063a2b40d1911610095578063c87b56dd11610064578063c87b56dd14610633578063cecf13f514610670578063d56b28891461069b578063e985e9c5146106a5576101cd565b8063a2b40d19146105c0578063ababa4a7146105e9578063b88d4fde14610600578063bc8e9e1614610629576101cd565b806395d89b41116100d157806395d89b411461051657806396af085c14610541578063a035b1fe1461056c578063a22cb46514610597576101cd565b80637f032c4f14610497578063890eba68146104c05780638da5cb5b146104eb576101cd565b80633004511f1161016f578063449107b61161013e578063449107b6146103b55780635afa3a72146103e05780636352211e1461041d57806370a082311461045a576101cd565b80633004511f1461030b578063360439fc146103365780633c130d901461036157806342842e0e1461038c576101cd565b8063095ea7b3116101ab578063095ea7b3146102775780630f15f4c0146102a057806323b872dd146102b7578063270c7be0146102e0576101cd565b806301ffc9a7146101d257806306fdde031461020f578063081812fc1461023a575b600080fd5b3480156101de57600080fd5b506101f960048036038101906101f491906127d9565b6106e2565b6040516102069190612c47565b60405180910390f35b34801561021b57600080fd5b506102246107c4565b6040516102319190612c62565b60405180910390f35b34801561024657600080fd5b50610261600480360381019061025c919061288f565b610856565b60405161026e9190612be0565b60405180910390f35b34801561028357600080fd5b5061029e60048036038101906102999190612799565b6108db565b005b3480156102ac57600080fd5b506102b56109f3565b005b3480156102c357600080fd5b506102de60048036038101906102d99190612683565b610a6a565b005b3480156102ec57600080fd5b506102f5610aca565b6040516103029190612be0565b60405180910390f35b34801561031757600080fd5b50610320610ae2565b60405161032d9190612c47565b60405180910390f35b34801561034257600080fd5b5061034b610af5565b6040516103589190612c47565b60405180910390f35b34801561036d57600080fd5b50610376610b08565b6040516103839190612c62565b60405180910390f35b34801561039857600080fd5b506103b360048036038101906103ae9190612683565b610b96565b005b3480156103c157600080fd5b506103ca610bb6565b6040516103d79190612be0565b60405180910390f35b3480156103ec57600080fd5b5061040760048036038101906104029190612833565b610bdc565b6040516104149190612e84565b60405180910390f35b34801561042957600080fd5b50610444600480360381019061043f919061288f565b610d3d565b6040516104519190612be0565b60405180910390f35b34801561046657600080fd5b50610481600480360381019061047c9190612616565b610def565b60405161048e9190612e84565b60405180910390f35b3480156104a357600080fd5b506104be60048036038101906104b99190612616565b610ea7565b005b3480156104cc57600080fd5b506104d5610f80565b6040516104e29190612c47565b60405180910390f35b3480156104f757600080fd5b50610500610f93565b60405161050d9190612be0565b60405180910390f35b34801561052257600080fd5b5061052b610fb9565b6040516105389190612c62565b60405180910390f35b34801561054d57600080fd5b5061055661104b565b6040516105639190612e84565b60405180910390f35b34801561057857600080fd5b50610581611051565b60405161058e9190612e84565b60405180910390f35b3480156105a357600080fd5b506105be60048036038101906105b99190612759565b611057565b005b3480156105cc57600080fd5b506105e760048036038101906105e2919061288f565b61106d565b005b3480156105f557600080fd5b506105fe6110e0565b005b34801561060c57600080fd5b50610627600480360381019061062291906126d6565b611157565b005b6106316111b9565b005b34801561063f57600080fd5b5061065a6004803603810190610655919061288f565b6112fd565b6040516106679190612c62565b60405180910390f35b34801561067c57600080fd5b5061068561144f565b6040516106929190612be0565b60405180910390f35b6106a3611475565b005b3480156106b157600080fd5b506106cc60048036038101906106c79190612643565b6116ec565b6040516106d99190612c47565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806107ad57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806107bd57506107bc82611780565b5b9050919050565b6060600080546107d3906130da565b80601f01602080910402602001604051908101604052809291908181526020018280546107ff906130da565b801561084c5780601f106108215761010080835404028352916020019161084c565b820191906000526020600020905b81548152906001019060200180831161082f57829003601f168201915b5050505050905090565b6000610861826117ea565b6108a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089790612de4565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006108e682610d3d565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610957576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161094e90612e44565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610976611856565b73ffffffffffffffffffffffffffffffffffffffff1614806109a557506109a48161099f611856565b6116ec565b5b6109e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109db90612d24565b60405180910390fd5b6109ee838361185e565b505050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a4d57600080fd5b6001600960146101000a81548160ff021916908315150217905550565b610a7b610a75611856565b82611917565b610aba576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab190612e64565b60405180910390fd5b610ac58383836119f5565b505050565b73662e332994fd6a834ed965e6ed45643108eeef1c81565b600960159054906101000a900460ff1681565b600960169054906101000a900460ff1681565b600c8054610b15906130da565b80601f0160208091040260200160405190810160405280929190818152602001828054610b41906130da565b8015610b8e5780601f10610b6357610100808354040283529160200191610b8e565b820191906000526020600020905b815481529060010190602001808311610b7157829003601f168201915b505050505081565b610bb183838360405180602001604052806000815250611157565b505050565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c3857600080fd5b82600c9080519060200190610c4e92919061242a565b50610c7c600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001611c51565b610d116001600c8054610c8e906130da565b80601f0160208091040260200160405190810160405280929190818152602001828054610cba906130da565b8015610d075780601f10610cdc57610100808354040283529160200191610d07565b820191906000526020600020905b815481529060010190602001808311610cea57829003601f168201915b5050505050611e1f565b81600a819055506001600960146101000a81548160ff0219169083151502179055506001905092915050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610de6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ddd90612d64565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610e60576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e5790612d44565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610f0157600080fd5b600960159054906101000a900460ff1615156000151514610f2157600080fd5b80600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600960156101000a81548160ff02191690831515021790555050565b600960149054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060018054610fc8906130da565b80601f0160208091040260200160405190810160405280929190818152602001828054610ff4906130da565b80156110415780601f1061101657610100808354040283529160200191611041565b820191906000526020600020905b81548152906001019060200180831161102457829003601f168201915b5050505050905090565b600b5481565b600a5481565b611069611062611856565b8383611e93565b5050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146110c757600080fd5b600b546000146110d657600080fd5b80600a8190555050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461113a57600080fd5b6001600960166101000a81548160ff021916908315150217905550565b611168611162611856565b83611917565b6111a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161119e90612e64565b60405180910390fd5b6111b384848484612000565b50505050565b600b5434116111c757600080fd5b600a5434116111d557600080fd5b60011515600960149054906101000a900460ff161515146111f557600080fd5b60011515600960159054906101000a900460ff1615151461121557600080fd5b60011515600960169054906101000a900460ff1615151461123557600080fd5b6000600b5411156112ac57600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600b549081150290604051600060405180830381858888f193505050501580156112aa573d6000803e3d6000fd5b505b33600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600b8190555034600a81905550565b6060611308826117ea565b611347576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161133e90612dc4565b60405180910390fd5b6000600660008481526020019081526020016000208054611367906130da565b80601f0160208091040260200160405190810160405280929190818152602001828054611393906130da565b80156113e05780601f106113b5576101008083540402835291602001916113e0565b820191906000526020600020905b8154815290600101906020018083116113c357829003601f168201915b5050505050905060006113f161205c565b905060008151141561140757819250505061144a565b60008251111561143c578082604051602001611424929190612bbc565b6040516020818303038152906040529250505061144a565b61144584612073565b925050505b919050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146114cf57600080fd5b61151f600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660016119f5565b6000600b819055506000600960146101000a81548160ff02191690831515021790555073662e332994fd6a834ed965e6ed45643108eeef1c73ffffffffffffffffffffffffffffffffffffffff166108fc60324761157d9190612fbf565b9081150290604051600060405180830381858888f193505050501580156115a8573d6000803e3d6000fd5b50600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6032476115f29190612fbf565b9081150290604051600060405180830381858888f1935050505015801561161d573d6000803e3d6000fd5b50600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015611686573d6000803e3d6000fd5b50600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166118d183610d3d565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611922826117ea565b611961576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161195890612d04565b60405180910390fd5b600061196c83610d3d565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806119db57508373ffffffffffffffffffffffffffffffffffffffff166119c384610856565b73ffffffffffffffffffffffffffffffffffffffff16145b806119ec57506119eb81856116ec565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16611a1582610d3d565b73ffffffffffffffffffffffffffffffffffffffff1614611a6b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6290612e04565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611adb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ad290612cc4565b60405180910390fd5b611ae683838361211a565b611af160008261185e565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b419190612ff0565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b989190612f69565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611cc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cb890612da4565b60405180910390fd5b611cca816117ea565b15611d0a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d0190612ca4565b60405180910390fd5b611d166000838361211a565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d669190612f69565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b611e28826117ea565b611e67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e5e90612d84565b60405180910390fd5b80600660008481526020019081526020016000209080519060200190611e8e92919061242a565b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611f02576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ef990612ce4565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611ff39190612c47565b60405180910390a3505050565b61200b8484846119f5565b6120178484848461211f565b612056576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161204d90612c84565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b606061207e826117ea565b6120bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016120b490612e24565b60405180910390fd5b60006120c761205c565b905060008151116120e75760405180602001604052806000815250612112565b806120f1846122b6565b604051602001612102929190612bbc565b6040516020818303038152906040525b915050919050565b505050565b60006121408473ffffffffffffffffffffffffffffffffffffffff16612417565b156122a9578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02612169611856565b8786866040518563ffffffff1660e01b815260040161218b9493929190612bfb565b602060405180830381600087803b1580156121a557600080fd5b505af19250505080156121d657506040513d601f19601f820116820180604052508101906121d39190612806565b60015b612259573d8060008114612206576040519150601f19603f3d011682016040523d82523d6000602084013e61220b565b606091505b50600081511415612251576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161224890612c84565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149150506122ae565b600190505b949350505050565b606060008214156122fe576040518060400160405280600181526020017f30000000000000000000000000000000000000000000000000000000000000008152509050612412565b600082905060005b600082146123305780806123199061313d565b915050600a826123299190612fbf565b9150612306565b60008167ffffffffffffffff81111561234c5761234b613273565b5b6040519080825280601f01601f19166020018201604052801561237e5781602001600182028036833780820191505090505b5090505b6000851461240b576001826123979190612ff0565b9150600a856123a69190613186565b60306123b29190612f69565b60f81b8183815181106123c8576123c7613244565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856124049190612fbf565b9450612382565b8093505050505b919050565b600080823b905060008111915050919050565b828054612436906130da565b90600052602060002090601f016020900481019282612458576000855561249f565b82601f1061247157805160ff191683800117855561249f565b8280016001018555821561249f579182015b8281111561249e578251825591602001919060010190612483565b5b5090506124ac91906124b0565b5090565b5b808211156124c95760008160009055506001016124b1565b5090565b60006124e06124db84612ec4565b612e9f565b9050828152602081018484840111156124fc576124fb6132a7565b5b612507848285613098565b509392505050565b600061252261251d84612ef5565b612e9f565b90508281526020810184848401111561253e5761253d6132a7565b5b612549848285613098565b509392505050565b60008135905061256081613745565b92915050565b6000813590506125758161375c565b92915050565b60008135905061258a81613773565b92915050565b60008151905061259f81613773565b92915050565b600082601f8301126125ba576125b96132a2565b5b81356125ca8482602086016124cd565b91505092915050565b600082601f8301126125e8576125e76132a2565b5b81356125f884826020860161250f565b91505092915050565b6000813590506126108161378a565b92915050565b60006020828403121561262c5761262b6132b1565b5b600061263a84828501612551565b91505092915050565b6000806040838503121561265a576126596132b1565b5b600061266885828601612551565b925050602061267985828601612551565b9150509250929050565b60008060006060848603121561269c5761269b6132b1565b5b60006126aa86828701612551565b93505060206126bb86828701612551565b92505060406126cc86828701612601565b9150509250925092565b600080600080608085870312156126f0576126ef6132b1565b5b60006126fe87828801612551565b945050602061270f87828801612551565b935050604061272087828801612601565b925050606085013567ffffffffffffffff811115612741576127406132ac565b5b61274d878288016125a5565b91505092959194509250565b600080604083850312156127705761276f6132b1565b5b600061277e85828601612551565b925050602061278f85828601612566565b9150509250929050565b600080604083850312156127b0576127af6132b1565b5b60006127be85828601612551565b92505060206127cf85828601612601565b9150509250929050565b6000602082840312156127ef576127ee6132b1565b5b60006127fd8482850161257b565b91505092915050565b60006020828403121561281c5761281b6132b1565b5b600061282a84828501612590565b91505092915050565b6000806040838503121561284a576128496132b1565b5b600083013567ffffffffffffffff811115612868576128676132ac565b5b612874858286016125d3565b925050602061288585828601612601565b9150509250929050565b6000602082840312156128a5576128a46132b1565b5b60006128b384828501612601565b91505092915050565b6128c581613024565b82525050565b6128d481613036565b82525050565b60006128e582612f26565b6128ef8185612f3c565b93506128ff8185602086016130a7565b612908816132b6565b840191505092915050565b600061291e82612f31565b6129288185612f4d565b93506129388185602086016130a7565b612941816132b6565b840191505092915050565b600061295782612f31565b6129618185612f5e565b93506129718185602086016130a7565b80840191505092915050565b600061298a603283612f4d565b9150612995826132c7565b604082019050919050565b60006129ad601c83612f4d565b91506129b882613316565b602082019050919050565b60006129d0602483612f4d565b91506129db8261333f565b604082019050919050565b60006129f3601983612f4d565b91506129fe8261338e565b602082019050919050565b6000612a16602c83612f4d565b9150612a21826133b7565b604082019050919050565b6000612a39603883612f4d565b9150612a4482613406565b604082019050919050565b6000612a5c602a83612f4d565b9150612a6782613455565b604082019050919050565b6000612a7f602983612f4d565b9150612a8a826134a4565b604082019050919050565b6000612aa2602e83612f4d565b9150612aad826134f3565b604082019050919050565b6000612ac5602083612f4d565b9150612ad082613542565b602082019050919050565b6000612ae8603183612f4d565b9150612af38261356b565b604082019050919050565b6000612b0b602c83612f4d565b9150612b16826135ba565b604082019050919050565b6000612b2e602983612f4d565b9150612b3982613609565b604082019050919050565b6000612b51602f83612f4d565b9150612b5c82613658565b604082019050919050565b6000612b74602183612f4d565b9150612b7f826136a7565b604082019050919050565b6000612b97603183612f4d565b9150612ba2826136f6565b604082019050919050565b612bb68161308e565b82525050565b6000612bc8828561294c565b9150612bd4828461294c565b91508190509392505050565b6000602082019050612bf560008301846128bc565b92915050565b6000608082019050612c1060008301876128bc565b612c1d60208301866128bc565b612c2a6040830185612bad565b8181036060830152612c3c81846128da565b905095945050505050565b6000602082019050612c5c60008301846128cb565b92915050565b60006020820190508181036000830152612c7c8184612913565b905092915050565b60006020820190508181036000830152612c9d8161297d565b9050919050565b60006020820190508181036000830152612cbd816129a0565b9050919050565b60006020820190508181036000830152612cdd816129c3565b9050919050565b60006020820190508181036000830152612cfd816129e6565b9050919050565b60006020820190508181036000830152612d1d81612a09565b9050919050565b60006020820190508181036000830152612d3d81612a2c565b9050919050565b60006020820190508181036000830152612d5d81612a4f565b9050919050565b60006020820190508181036000830152612d7d81612a72565b9050919050565b60006020820190508181036000830152612d9d81612a95565b9050919050565b60006020820190508181036000830152612dbd81612ab8565b9050919050565b60006020820190508181036000830152612ddd81612adb565b9050919050565b60006020820190508181036000830152612dfd81612afe565b9050919050565b60006020820190508181036000830152612e1d81612b21565b9050919050565b60006020820190508181036000830152612e3d81612b44565b9050919050565b60006020820190508181036000830152612e5d81612b67565b9050919050565b60006020820190508181036000830152612e7d81612b8a565b9050919050565b6000602082019050612e996000830184612bad565b92915050565b6000612ea9612eba565b9050612eb5828261310c565b919050565b6000604051905090565b600067ffffffffffffffff821115612edf57612ede613273565b5b612ee8826132b6565b9050602081019050919050565b600067ffffffffffffffff821115612f1057612f0f613273565b5b612f19826132b6565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612f748261308e565b9150612f7f8361308e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612fb457612fb36131b7565b5b828201905092915050565b6000612fca8261308e565b9150612fd58361308e565b925082612fe557612fe46131e6565b5b828204905092915050565b6000612ffb8261308e565b91506130068361308e565b925082821015613019576130186131b7565b5b828203905092915050565b600061302f8261306e565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156130c55780820151818401526020810190506130aa565b838111156130d4576000848401525b50505050565b600060028204905060018216806130f257607f821691505b6020821081141561310657613105613215565b5b50919050565b613115826132b6565b810181811067ffffffffffffffff8211171561313457613133613273565b5b80604052505050565b60006131488261308e565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561317b5761317a6131b7565b5b600182019050919050565b60006131918261308e565b915061319c8361308e565b9250826131ac576131ab6131e6565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008201527f73206e6f74206f776e0000000000000000000000000000000000000000000000602082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b61374e81613024565b811461375957600080fd5b50565b61376581613036565b811461377057600080fd5b50565b61377c81613042565b811461378757600080fd5b50565b6137938161308e565b811461379e57600080fd5b5056fea2646970667358221220d1fd331ddabd79bff5546dd713d9359301e0326b302f25148b8d1cffb8c8802c64736f6c63430008070033")
  }