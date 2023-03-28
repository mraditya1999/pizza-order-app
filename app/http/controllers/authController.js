const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
  const _getRedirectUrl = (req) => {
    // return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
    return '/';
  };

  return {
    // LOGIN GET request
    login(req, res) {
      res.render('auth/login');
    },

    async loginUser(req, res, next) {
      const { email, password } = req.body;
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }
        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },

    // REGISTER GET request
    register(req, res) {
      res.render('auth/register');
    },

    // REGISTER POST request
    async registerUser(req, res) {
      const { name, email, password } = req.body;
      // Check if email exists
      const foundUser = await User.find({ email: email }).exec();
      if (foundUser.length > 0) {
        req.flash('error', 'Email already exists');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          // Login
          return res.redirect('/');
        })
        .catch((err) => {
          req.flash('error', 'Something went wrong');
          // return res.redirect('/register');
        });
    },

    // LOGOUT post request
    logoutUser(req, res, next) {
      req.logout(function (err) {
        if (err) return next(err);
        res.redirect('/login');
      });
    },

    // Forgot password
    forget(req, res) {
      res.render('auth/forget');
    },
  };
}

module.exports = authController;
