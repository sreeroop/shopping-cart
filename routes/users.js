const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/productHelpers');
var userHelpers = require('../helpers/userHelpers');

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async (req, res, next) => {
  let user = req.session.user;
  let cartCount = null;
  if (user)
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user, cartCount });
  })
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else res.render('user/login', { loginErr: req.session.loginErr })
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelpers.doSignUp(req.body).then((response) => {
    req.session.loggedIn = true
    req.session.user = response
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid user name or password";
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let cartProds = await userHelpers.getCartProducts(req.session.user._id)
  res.render('user/cart', { cartProds, user: req.session.user })

})
router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
  userHelpers.addToCart(req.params.id, req.session.user._id)
  try {
    res.json({ status: true })

  } catch (err) {
    console.log(err)
  }
})
router.post('/change-product-quantity', (req, res, next) => {
  userHelpers.changeQuantity(req.body).then((response) => {
    console.log(response)
    res.json(response)
  })
})
router.post('/remove-cart-product', async (req, res) => {
  await userHelpers.removeCartProduct(req.body).then((response) => {
    console.log("ji", response)
    res.json(response)
  })
  // userHelpers.removeCartProduct(req.body)
})

module.exports = router;
