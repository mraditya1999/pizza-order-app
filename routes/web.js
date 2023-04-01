const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const orderStatusController = require('../app/http/controllers/admin/statusController');
const productController = require('../app/http/controllers/admin/productController');

// Middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

function initRoutes(app) {
  // GET requests
  app.get('/', homeController().index);
  app.get('/login', guest, authController().login);
  app.post('/login', authController().loginUser);
  app.get('/register', guest, authController().register);
  app.post('/register', authController().registerUser);
  app.post('/logout', authController().logoutUser);
  app.get('/forget', authController().forget);

  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);

  // POST requests
  //FIXME: app.post('/delete-cart', cartController().delete);
  app.get('/offers', homeController().offers);
  //
  //
  //
  // Product routes
  app.get('/admin/products', admin, productController().store);
  app.post('/admin/products', admin, productController().storeProduct);
  // app.put('/admin/products', productController().updateProduct);
  //
  //
  //

  // Customer routes
  app.post('/orders', auth, orderController().store);
  app.get('/customer/orders', auth, orderController().index);
  app.get('/customer/orders/:id', auth, orderController().show);
  app.get('/profile', auth, orderController().profile);

  // Admin routes
  app.get('/admin/orders', admin, adminOrderController().index);
  app.post('/admin/order/status', admin, orderStatusController().update);
}

module.exports = initRoutes;
