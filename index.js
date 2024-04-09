const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8081;

const crypto = require("crypto");
const algorithm = "aes-256-gcm";
const iv = Buffer.from('AAAAAAAAAAAAAAAAAAAAAA==', 'base64url');

app.get('/token', async (req, res) => {
  try {
    var input = req.query.request_token;
    var inputKey = req.query.secret_key;
    if(input && inputKey) {
      var decBytes = Buffer.from(input, 'base64url');
      var Secretkey = Buffer.from(inputKey, "utf-8");
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
    } else {
      res.status(400).send('Invalid Input parameters');
    }
  } catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.get('/scripmaster', async (req, res) => {
  try {
    var accessToken = req.query.access_token;
    if(accessToken) {
      axios.get('https://api.sharekhan.com/skapi/services/master/NF', {
        headers: {
          'Content-Type': 'application/json',
          'access-token': `${accessToken}`
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error:', error)
      });
      res.send(encData);
    } else {
      res.status(400).send('Invalid Input parameters');
    }
  } catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
