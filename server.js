const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const { APP_PORT, DB_URL, COOKIE_SECRET } = require('./app/config');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');

// Database Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected');
});

// Session Store
let mongoStore = MongoDbStore.create({
  mongoUrl: DB_URL,
  collection: 'sessions',
});

// Session config
app.use(
  session({
    secret: COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    // session will automatically expire after 24 hours
  })
);

// Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(flash());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressEjsLayouts);

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Views
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Routes
require('./routes/web')(app);

app.listen(APP_PORT, () => {
  console.log(`Server is running on port http://localhost:${APP_PORT}`);
});
