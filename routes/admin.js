var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/productHelpers')

/* GET users listing. */
router.get('/view-products', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-products', { products, admin: true });
  })
});
router.get('/add-products', (req, res) => {
  res.render('admin/add-product', { admin: true })
})
router.post('/add-products', (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv('./public/product-image/' + id + '.png', (err, data) => {
      if (!err) {
        res.render('admin/add-product', { admin: true })
      }
      else {
        console.log(`error is ${err}`)
      }
    })
  })

})

module.exports = router;
