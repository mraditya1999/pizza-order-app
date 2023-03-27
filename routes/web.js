const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middlewares/guest');

function initRoutes(app) {
  // GET requests
  app.get('/', homeController().index);
  app.get('/login', guest, authController().login);
  app.get('/register', guest, authController().register);
  app.get('/forget', authController().forget);
  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);

  // POST requests
  //FIXME: app.post('/delete-cart', cartController().delete);
  app.post('/login', authController().loginUser);
  app.post('/logout', authController().logoutUser);
  app.post('/register', authController().registerUser);
}

module.exports = initRoutes;
