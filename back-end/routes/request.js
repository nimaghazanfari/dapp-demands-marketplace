const path = require('path');
const express = require('express');
const fs = require('fs');
const Web3 = require('web3');
const router = express.Router();
const Request = require('../model/Request');
const mockData = require('../basic_data/mock_users');

const pathToAbi = path.resolve('../blockchain/build/contracts/Escrow.json');

//default ganache-cli setup
const web3 = new Web3('http://localhost:8545');

const getContract = () => {
  const artifact = fs.readFileSync(pathToAbi, 'utf-8');

  const json = JSON.parse(artifact);
  const networks = json.networks;
  const addresss = networks[Object.keys(networks)[0]].address;

  const contract = new web3.eth.Contract(json.abi, addresss);

  return contract;
}

const getOwner = async () => {
  const [owner] = await web3.eth.getAccounts();
  return owner;
}

const validateCustomer = (req, res, next) => {
  const { authorization, role } = req.headers;

  //check bearer token -- only customer
  if (role === "customer" && mockData.findIndex(a => a.token == authorization) > -1) next();
  else res.status(401).send();
}

//first authorize, then do the job
router.use(validateCustomer).post('/new', async (req, res, next) => {

  const { user } = req.headers;
  const {
    requestId,
    tx,
    ethers,
    payer,
    open,
    title,
    desc
  } = req.body;

  const newRequest = new Request({
    requestId,
    tx,
    payer,
    customer_username: user,
    ethers,
    open,
    title,
    desc
  });

  await newRequest.save(newRequest);
  res.send('ok');

});

router.use(validateCustomer).post('/all', async (req, res, nex) => {

  const { user } = req.headers;
  if (!user) {
    res.status(400).send();
    return;
  }
  else {
    const query = await Request.where('customer_username').equals(user);
    res.send(query)
  }
})

router.use(validateCustomer).post('/confirm', async (req, res, next) => {

  const { user } = req.headers;
  const { requestId } = req.body;
  const filter = { 'customer_username': user, requestId };

  const query = await Request.find(filter);

  if (query && query.length) {
    const { requestId, doer, ethers } = query[0];

    if (doer && ethers) {
      //pay the doer

      const owner = await getOwner();
      const contract = getContract();

      try {
        //set price on each request into blockchain
        await Request.findOneAndUpdate(filter, { open: 4 });
        await contract.methods.withdraw(requestId, doer).send({ from: owner });

        res.send('ok');
      } catch (error) {
        res.status(400).send('Error Happened!');

      }
    }
  }

})

module.exports = router;