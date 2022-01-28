'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const fileUpload = require('express-fileupload');
const publicIp = require('public-ip');
const { NFTStorage, File } = require('nft.storage');
const AWS = require('aws-sdk');
const fsExtra = require('fs-extra')
const execSync = require('child_process').execSync;

fsExtra.emptyDirSync('./uploads/')

const s3 = new AWS.S3({
  accessKeyId: "XXXX",
  secretAccessKey: "XXX"
});

// Constants

const PORT = 8080;
const HOST = '0.0.0.0';

// Tokens

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQzYjY5NUYzN2NGRDkxODg0NWQ3MTgxQUY5RkEXXXXX"
const clientnft = new NFTStorage({ token: API_TOKEN })

// API Gateway Link

const APIGATEWAY = "XXXXXXXXXXX.execute-api.us-east-1.amazonaws.com"

// App

const app = express();

// CORS Options

app.use(cors());

// Middleware

app.use(morgan('dev'));
app.use(express.json())
app.use(fileUpload({
  createParentPath: true
}));

// Functions

function ipfsTohtml(uri) {
  let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
  let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
  return substring + substring2
}

function check(json) {
  try {
    if (json.headers.forwarded.replace("host=", "").split(";")[2] === APIGATEWAY) {
      return true
    }
    else {
      return false
    }
  }
  catch (err) {
    return false
  }
}

function getSnapshotFromVideo(uri, name) {
  return new Promise((resolve, reject) => {
    ffmpeg(uri)
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        resolve()
      })
      .screenshots({
        count: 1,
        filename: `${name}.png`,
        folder: './uploads/',
        size: '1280x720'
      })
  })
}

// App routes

app.get('/home', (req, res) => {
  if (check(req)) {
    res.send('Hello From The Arcade Server');
  }
  else {
    res.status(401).send("Unauthorized");
  }
});

app.get('/download-nft-file', async function (req, res) {
  if (check(req)) {
    let url = req.query.url;
    let start = req.query.start;
    let end = req.query.end;
    console.log(url);
    https.get(url, (ress) => {
      const dateName = Date.now().toString();
      const path = `${__dirname}/downloads/` + dateName;
      const filePath = fs.createWriteStream(path + ".mp4");
      ress.pipe(filePath);
      filePath.on('finish', () => {
        filePath.close();
        const command = `ffmpeg -ss ${start} -to ${end} -i ${path}.mp4 -c copy ${path}trim.mp4`
        let mes = execSync(command);
        fs.unlinkSync(`${path}.mp4`);
        res.download(`${path}trim.mp4`);
      })
    })
  }
  else {
    res.status(401).send("Unauthorized");
  }
})

app.post('/upload-video-nft-storage', async (req, res) => {
  if (check(req)) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let nft = req.files.nft;
        let my_date = Date.now();
        let dateName = my_date + `.${nft.mimetype.substring(6, nft.mimetype.length)}`;
        console.log(dateName);
        await nft.mv('./uploads/' + dateName)
        const command = `ffmpeg -ss 00:00:00 -i ${`uploads/` + dateName} -vframes 1 -q:v 2 ${'uploads/' + my_date + '.jpg'}`
        let mes = execSync(command);
        const file = fs.readFileSync(__dirname + '/uploads/' + dateName);
        const file2 = fs.readFileSync(__dirname + '/uploads/' + my_date + '.jpg');
        const realFile1 = new File([file], dateName, { type: `video/${nft.mimetype.substring(6, nft.mimetype.length)}` })
        const realFile2 = new File([file2], my_date + '.jpg', { type: `image/jpg` })
        let premetadat = {
          name: `${req.headers.name}`,
          external_url: `${req.headers.external_url}`,
          description: `${req.headers.description}`,
          image: realFile2,
          properties: {
            video: realFile1,
          },
          attributes: [
            {
              game: `${req.headers.game}`,
              streamer: `${req.headers.streamer}`,
              stream: `${req.headers.stream}`,
            }
          ]
        }
        let metadata = await clientnft.store(premetadat)
        const params = {
          Bucket: 'the-arcade-storage', // pass your bucket name
          Key: dateName, // file will be saved as 
          Body: file,
          ACL: 'public-read',
          ContentType: `video/${nft.mimetype.substring(6, nft.mimetype.length)}`
        };
        premetadat.image = metadata.url
        s3.upload(params, function (s3Err, data) {
          if (s3Err) throw s3Err;
          let temp = data.Location
          const params = {
            Bucket: 'the-arcade-storage', // pass your bucket name
            Key: my_date + '.jpg', // file will be saved as 
            Body: file2,
            ACL: 'public-read',
            ContentType: `image/jpg`
          };
          s3.upload(params, function (s3Err, data) {
            if (s3Err) throw s3Err;
            fs.unlinkSync('./uploads/' + dateName)
            fs.unlinkSync('./uploads/' + my_date + '.jpg')
            res.send({
              nft: ipfsTohtml(metadata.url),
              nftaws: temp,
              nftawsimage: data.Location,
              metadata: premetadat
            })
          });
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }
});

app.post('*', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let rawdata = fs.readFileSync('filter.json');
  let ips = JSON.parse(rawdata);
  ips["ips"].push(ip);
  let data = JSON.stringify(ips);
  fs.writeFileSync('filter.json', data);
  res.status(401).send("Banned");
});

app.get('*', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let rawdata = fs.readFileSync('filter.json');
  let ips = JSON.parse(rawdata);
  ips["ips"].push(ip);
  ips["ips"] = [...new Set(ips["ips"])];
  let data = JSON.stringify(ips);
  fs.writeFileSync('filter.json', data);
  res.status(401).send("Banned");
});

app.listen(PORT, HOST);

async function ip() {
  const value = await publicIp.v4()
  console.log(`Running on http://${value}:${PORT}`);
}

ip();