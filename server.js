// Node Packages
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');

const app = express();
const PORT = process.env.PORT || 3000;
const { APP_PORT, DB_URL, COOKIE_SECRET } = require('./app/config');

// Database Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected');
});

// Session config
app.use(
  session({
    secret: COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({ mongoUrl: DB_URL }),
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

// Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;

  next();
});

// Set Template Engine
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

// Routes
require('./routes/web')(app);
app.use('', (req, res) => {
  res.render('errors/404');
});

// Server
const server = app.listen(APP_PORT, () => {
  console.log(`Server is running on port http://localhost:${APP_PORT}`);
});

// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Socket
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  // Join
  socket.on('join', (roomName) => {
    socket.join(roomName);
  });
});

eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data);
});
