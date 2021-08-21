const express = require('express');
const router = express.Router();
const Request = require('../model/Request');
const mockData = require('../basic_data/mock_users');

const validateExpert = (req, res, next) => {
  const { authorization, role } = req.headers;

  //check bearer token -- only expert
  if (role === "expert" && mockData.findIndex(a => a.token == authorization) > -1) next();
  else res.status(401).send();
}

router.use(validateExpert).post('/avails', async (req, res, nex) => {

  const query = await Request.where('open').equals(1);
  res.send(query)

})

router.use(validateExpert).post('/mylist', async (req, res, nex) => {

  const { user } = req.headers;
  const doer = mockData.find(a => a.username === user).wallet;
  const query = await Request.find({ doer, open: { $gte: 2 } });

  res.send(query)

})

router.use(validateExpert).post('/doing', async (req, res, nex) => {

  const { user } = req.headers;
  const { requestId } = req.body;
  const filter = { requestId: requestId };

  const doer = mockData.find(a => a.username === user).wallet;

  await Request.findOneAndUpdate(filter, { doer, open: 2 });

  res.send('ok');
})

router.use(validateExpert).post('/done', async (req, res, nex) => {

  const { requestId } = req.body;
  const filter = { requestId: requestId };

  await Request.findOneAndUpdate(filter, { open: 3 });

  res.send('ok');
})

module.exports = router;
