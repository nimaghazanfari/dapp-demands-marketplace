var express = require('express');
var router = express.Router();
mockData = require('../basic_data/mock_users');
const Web3 = require('web3');

//connecting to ganache-cli
const web3 = new Web3('http://localhost:8545');

router.post('/login', function (req, res, next) {

  const { username, password } = req.body;
  const result = mockData.find(a => {
    return a.username == username && a.password == password
  });

  if (result != null) {

    const {
      displayName,
      token,
      wallet,
      role
    } = result;

    const wallet_short = `${wallet.substring(0, 6)}...${wallet.slice(-4)}`;

    res.send({ displayName, token, wallet, wallet_short, role });
  }
  else {
    res.status(400).send('Invalid Username/Password!');
  }

});

router.post('/wallet', async (req, res, nex) => {

  const { user } = req.headers;
  const { wallet, displayName } = mockData.find(a => a.username === user);

  const result = {
    wallet,
    displayName,
    ethers: await web3.eth.getBalance(wallet)
  }

  res.send(result);
})

module.exports = router;
