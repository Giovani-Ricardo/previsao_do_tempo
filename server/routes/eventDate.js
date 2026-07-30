var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const date = new Date('2026-05-26T21:39').toString();
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  res.json({eventDate: date});
});

module.exports = router;
