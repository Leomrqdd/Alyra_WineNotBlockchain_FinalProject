require('dotenv').config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(key, secret);
const fs = require('fs');
const Bottle1 = fs.createReadStream('Bottle1.png');
const Bottle2 = fs.createReadStream('Bottle2.png')
 
const options = {
    pinataMetadata: {
        name: "WineNotBlockchain_Bottle_NFT",
    },
    pinataOptions: {
        cidVersion: 0
    }
};
 
 
pinata.pinFileToIPFS(Bottle1, options).then((result) => {

    const body = {

    "name":"Wine-BlockBazaar",
    "description":"Romanée-Conti",
    "image": result.IpfsHash.png,
    "attributes": [
    {
      "trait_type": "productor name", 
      "value": "Domaine de la Romanée-Conti"
    }, 
    {
      "trait_type": "designation of origin", 
      "value": "Romanée-Conti Grand Cru, Côte de Nuits, Bourgogne, France"
    }, 
    {
      "trait_type": "Vintage", 
      "value": "1997"
    }, 
    {
      "trait_type": "Serial Number", 
      "value": 4
    }
  ]}


    pinata.pinJSONToIPFS(body, options).then((json) => {
        console.log(json);
    }).catch((err) => {
        console.log(err);
    });

 
}).catch((err) => {
    console.log(err);
});
