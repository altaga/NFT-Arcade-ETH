[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [<img src="https://img.shields.io/badge/View-Website-blue">](https://www.nft-arcade.online/) [<img src="https://img.shields.io/badge/View-Video-red">](https://youtu.be/pnt0hDOkI0k)

# NFT-Arcade

<img src="https://i.ibb.co/CJHWhjC/arc3.png" width="400">
 
Welcome to NFT Arcade.

###  NFT-Arcade is an NFT marketplace where streamers, creators and gamers can easily and quickly upload short videos of their best moments and turn them into NFTs.

This is our submission for the NFT Hack 2022.

#### Click here to watch our demo video:

[<img src="https://raw.githubusercontent.com/altaga/SCUP-WWAC/master/Images/click-here-button.png" width=200>](https://youtu.be/pnt0hDOkI0k)

## To test the product follow this link (Over here Tech judges!):
<a href="https://www.nft-arcade.online/" target="_blank" style="font-size:30px;">
https://www.nft-arcade.online/

### Use Mumbai Polygon TESTnet on METAMASK!!!!
</a>
<hr>

## How Add Polygon Network:
https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/
 
# Introduction and inspiration
 
NFTs have exploded into the world scene with huge valuations but most of it have been focusing on digital art-work.

It is true that we have huge companies like the NBA with top shots and now even Disney, Tiktok and Instagram ready for the taking of this growing market. Nevertheless there are few instances where there have been real disruptors in this space.

Streaming and Esports have become huge and growing. According to Business Insider, it is expected to grow at a 9% CAGR up from 454 million in 2019 to 646 million in 2023. The esports audience will grow on pace to nearly double over a six-year period, as the 2017 audience stood at 335 million.

<img src="https://res.cloudinary.com/devpost/image/fetch/s--VnMo5uNE--/c_limit,f_auto,fl_lossy,q_auto:eco,w_900/https://cdn.cnn.com/cnnnext/dam/assets/160530101317-esports-global-market-graphic-exlarge-169.jpg" width="600">

Streaming is another monster, in Twitch only Traffic continued to grow, with 1.5 million broadcasters and 100 million monthly viewers in 2015, rising to 2.2 million broadcasters and 15 million daily viewers in 2018. Average concurrent viewers have climbed to over 2 million in 2021, as Twitch saw huge growth during the coronavirus pandemic.

Twitch broadcasters, perhaps most famously Ninja, have featured on the cover of ESPN. Esports tournaments have drawn hundreds of thousands of concurrent viewers, with millions of dollars in prize money funded partly through the huge audience on Twitch.

They have made an estimated $2.3 billion revenue in 2020, primarily from subscriptions and IAP with its more than nine million users and its 18.6 billion hours of content that was consumed on the platform in 2020

<img src="https://i.ibb.co/hZpNsVS/twitch.png" width="800">

This is a huge market that has been overlooked by NFT marketplaces...until now.
 
# Solution
 
Enter NFT Arcade, an NFT marketplace where streamers, creators and gamers can easily and quickly upload short videos of their best moments and turn them into NFTs.

For all Blockchain interactions we use the Moralis' RPC to connecto to Polygon on the Mumbai testnet:

      ​const​ ​dataweb3​ ​=​ ​new​ ​Web3​(​"https://speedy-nodes-nyc.moralis.io/9bf061a781e6175f3e78d615/polygon/mumbai"​)​;

<img src="https://i.ibb.co/3YKwHVK/main-drawio.png">

Our NFT Arcade page is already operational and ONLINE. It has all the basic functions of any NFT marketplace or Streaming platform but of course, based around those gaming moments, pumped by moralis RPC.

<img src="https://i.ibb.co/4ppjHqT/image.png">

To view the streaming's or the NFTs you don't require an account, however in order to increase the offer to buy the NFTs it is necessary to connect a metamask wallet in order to increase the bid for the NFT.

In turn, the NFT and its contract can be viewed on Polygon Scan.

Or even follow the Content creator directly on their social networks.

<img src="https://i.ibb.co/7VMbKYj/image.png">

The most important part of the project is for the viewers or creators to be able to upload a video moment of their stream or content and quickly make it into an NFT. 

# Livepeer:

All the streaming service was done through Livepeer.

<img src="https://i.ibb.co/3TmFdyx/livepeer-drawio.png">

## Streamers:

To manage Streamers, the profiles of each of the Streamers were created within the Livepeer dashboard, with which we were able to provide each Streamer with their keys to perform their Streams.

<img src="https://i.ibb.co/X7fKN3Q/image.png">

## Live Streaming:

Thanks to the Livepeer APIs it was possible for us to obtain if the Streamers were doing a Live, thanks to this the viewers could always be aware when a live stream is made.

<img src="https://i.ibb.co/5n5yKDR/image.png">

# Mint Process:

The plan for the future is to be rolling a lot of activities and contests with the content creators and their fans in order to attract more and more people to the platform.

Uploading your NFT is as simple as connecting your metamask account and going through the entire process of uploading the file to NFT.storage and mint which happens on the backend. For now we have a cap of 10mb for each video gaming moment.

The process of uploading an NFT is as follows.

First, we must deploy the NFT contract, this contract handles the bids, NFT transfer and mint.

<img src="https://i.ibb.co/YhLNRVZ/image.png">

Once the contract is displayed on the Polygon network, the NFT File creator will appear. Here you can select the creator and the stream from which you want to obtain the clip, once selected, you will select the duration and press the download button.

These videos are downloaded directly from the Livepeer service.

<img src="https://i.ibb.co/8dxyCTC/image.png">

Press continue and the form will appear to fill in all the NFT data and upload the file.

<img src="https://i.ibb.co/4d1k9zK/image.png">

## IPFS:

We do all the NFT storage on IPFS through the services of NFT.storage, thanks to this we can adhere to the NFT standards.

You can check on the metadata of each NFT Live, that it is indeed uploaded there.

Here is a sample of the metadata of one of our NFTs.

<img src="https://i.ibb.co/P9bCz1x/image.png">

<hr/>

<img src="https://i.ibb.co/qyBVvTq/image.png">

<hr/>

<img src="https://i.ibb.co/DwVvpjw/image.png">

In turn, here is the code that we have running on our server to upload the file from the web page and send it to NFT.Storage through an API.

And as a result, we obtain the metadata that we will use in the mint section of the NFT upload process.

Once we finish configuring the data, we write the price that the NFT will have, and we give it mint.

Once the NFT has been minted, it is ready to be viewed on our platform, where it can be traded.

# What's next

There are Marketplaces for great sports moments created by the NBA and one coming for the NFL, but of course this is heavily centralized and controlled. We can do a similar concept through streaming platforms, gaming and creators with NFT Arcade but of course in a much more decentralized way where the NFT belongs not to a company, but to the people that mint and buy it.

For now this is a PoC of what the final product would be, we will be moving social networks the coming weeks to gauge the market and to see what is best for us to go to market.

Hopefully you liked the project and please support your Arcade, the NFT Arcade.

# Team
[<img src="https://img.shields.io/badge/Luis%20Eduardo-Arevalo%20Oliver-blue">](https://www.linkedin.com/in/luis-eduardo-arevalo-oliver-989703122/)

[<img src="https://img.shields.io/badge/Victor%20Alonso-Altamirano%20Izquierdo-lightgrey">](https://www.linkedin.com/in/alejandro-s%C3%A1nchez-guti%C3%A9rrez-11105a157/)

[<img src="https://img.shields.io/badge/Alejandro-Sanchez%20Gutierrez-red">](https://www.linkedin.com/in/victor-alonso-altamirano-izquierdo-311437137/)


# Tech:

## General Diagram:
The entire application is differentiated into two types of services where the application obtains its data to function.

<img src="https://i.ibb.co/3YKwHVK/main-drawio.png">

## Decentralized Services (Web3.js and communication with Smart Contracts):

- Moralis:
	- Obtaining prices and metadata of the NFTs in real time.
- Moralis (w/Metamask):
	- Deployment of the contract on the Polygon Network (Mumbai).
	- NFT Mint.
	- Sale of NFTs through Interaction with Smart Contract.
- Livepeer:
  - User Management.
  - Live Streams.
  - CDN service.
  - Transcoding.
- NFT.Storage:
  - NFT IPFS storage and metadata.json and YES we are storing the videos on IPFS through NFT.storage.

## Frameworks:

- ReactJS: Creation of the page in frontend.
- Remix IDE: Creation and compilation of the Smart contract.

# References
    
https://www.businessofapps.com/data/twitch-statistics/
 
