import axios from 'axios';
import Noty from 'noty';

let addTocart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cart-counter');

function updateCart(pizza) {
  //
  axios
    .post('/update-cart', pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: 'success',
        text: 'Item added to cart',
        timeout: 1000,
        progressBar: false,
        layout: 'topLeft',
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: 'error',
        text: 'Something went wrong',
        timeout: 1000,
        progressBar: false,
        layout: 'topLeft',
      }).show();
    });
}

addTocart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let pizza = JSON.parse(btn.dataset.item);
    updateCart(pizza);
  });
});
