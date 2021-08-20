const path = require('path');
const express = require('express');
const router = express.Router();
const mockData = require('../basic_data/mock_users');

const validateUser = (req, res, next) => {
  const { authorization } = req.headers;

  //check bearer token
  if (mockData.findIndex(a => a.token == authorization) > -1) next();
  else res.status(401).send();
}

const pathToAbi = path.resolve('../blockchain/build/contracts/Escrow.json');

//first authorize, then do the job
router.use(validateUser).post('/get-abi', (req, res) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(pathToAbi);
});

module.exports = router;
