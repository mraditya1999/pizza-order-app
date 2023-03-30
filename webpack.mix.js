let mix = require('laravel-mix');

mix.js('resources/javascript/app.js', 'public/javascript/app.js');
mix.sass('resources/scss/app.scss', 'public/css/app.css');
mix.babelConfig({
  plugins: ['@babel/plugin-syntax-dynamic-import'],
});
