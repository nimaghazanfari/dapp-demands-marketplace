var express = require('express');
var router = express.Router();

// server is up and running
router.get('/', function (req, res, next) {
  res.send('Hello, World!');
});

module.exports = router;
