const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8081;

const crypto = require("crypto");
const algorithm = "aes-256-gcm";
const iv = Buffer.from('AAAAAAAAAAAAAAAAAAAAAA==', 'base64url');
const Secretkey = Buffer.from("mKB0liuPanLGXTyImPKq9ymAfdDVo8pG", "utf-8");

app.get('/token', async (req, res) => {
  try {
    var input = req.query.data;
    var decBytes = Buffer.from(input, 'base64url');
    var dec = decBytes.slice(0,decBytes.length-16);
    var decipher = crypto.createDecipheriv(algorithm, Secretkey, iv);
    var encTxt = decipher.update(dec.toString('base64url'), 'base64url', 'utf8');

    var message = encTxt.split('|')[1] + "|" + encTxt.split('|')[0];
    var cipher = crypto.createCipheriv(algorithm, Secretkey, iv);
    var ciph = cipher.update(message, 'utf8', 'base64url');
    ciph += cipher.final('base64url');
    var combinedBytes = [Buffer.from(ciph, 'base64'), cipher.getAuthTag()];
    var encData=Buffer.concat(combinedBytes).toString('base64url');
    res.send(encData);
  } catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
