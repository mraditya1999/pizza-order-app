const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.static('public'));
app.use(expressEjsLayouts);

// Views
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/cart', (req, res) => {
  res.render('customers/cart');
});

app.get('/login', (req, res) => {
  res.render('auth/login');
});

app.get('/register', (req, res) => {
  res.render('auth/register');
});

app.get('/forget', (req, res) => {
  res.render('auth/forget');
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
