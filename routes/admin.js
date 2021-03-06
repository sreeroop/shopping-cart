const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/productHelpers')

/* GET users listing. */
router.get('/', function (req, res, next) {
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
router.get('/delete-product/:id', (req, res) => {
  const prodId = req.params.id;
  productHelpers.deleteProduct(prodId).then((response) => {
    console.log(response)
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product', { product })
})
router.post('/edit-product/:id', (req, res) => {
  productHelpers.updateProduct(req.params.id, req.body)
  try {
    res.redirect('/admin/')
    if (req.files.image) {
      let image = req.files.image;
      image.mv('./public/product-image/' + req.params.id + '.png')
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
