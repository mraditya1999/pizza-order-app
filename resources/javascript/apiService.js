import axios from 'axios';
import Noty from 'noty';

export function placeOrder(formObject) {
  axios
    .post('/orders', formObject)
    .then((res) => {
      new Noty({
        type: 'success',
        text: res.data.message,
        timeout: 1000,
        progressBar: false,
        layout: 'topLeft',
      }).show();
      setTimeout(() => {
        window.location.href = '/customer/orders';
      }, 1000);
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
