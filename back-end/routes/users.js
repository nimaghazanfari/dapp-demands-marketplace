var express = require('express');
var router = express.Router();
mockData = require('../basic_data/mock_users');

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

module.exports = router;
