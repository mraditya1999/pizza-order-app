const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  APP_PORT,
  DB_URL,
  APP_URL,
  COOKIE_SECRET,
  STRIPE_PRIVATE_KEY,
} = process.env;
