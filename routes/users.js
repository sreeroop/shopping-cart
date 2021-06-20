var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: "abc",
      category: "hello",
      desc: "whoooo nise nise",
      image: "https://bit.ly/3cW9cSn"
    },
    {
      name: "abc2",
      category: "hello",
      desc: "whoooo nise nise",
      image: "https://bit.ly/3cW9cSn"
    },
    {
      name: "abc2",
      category: "hello",
      desc: "whoooo nise nise",
      image: "https://bit.ly/3cW9cSn"
    },
    {
      name: "abc3",
      category: "hello",
      desc: "whoooo nise nise",
      image: "https://bit.ly/3cW9cSn"
    }
  ];
  res.render('index', { products, admin: false });
});

module.exports = router;
