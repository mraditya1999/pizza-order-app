const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  APP_PORT,
  DEBUG_MODE,
  DB_URL,
  JWT_SECRET,
  REFRESH_SECRET,
  APP_URL,
  COOKIE_SECRET,
} = process.env;
