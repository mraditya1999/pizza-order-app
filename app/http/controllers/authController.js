function authController() {
  return {
    login(req, res) {
      res.render('auth/login');
    },
    register(req, res) {
      res.render('auth/register');
    },
    forget(req, res) {
      res.render('auth/forget');
    },
  };
}

module.exports = authController;
