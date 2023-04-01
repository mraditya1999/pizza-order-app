import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
import { initAdmin } from './admin';
import { initStripe } from './stripe';

let addTocart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cart-counter');

const navToggle = document.querySelector('.navbar-burger');
const navMenu = document.querySelector('.mobile-menu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('show-nav');
  navMenu.classList.toggle('show-nav');
});

function updateCart(pizza) {
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

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}
// Change order status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove('step-completed');
    status.classList.remove('current');
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add('step-completed');
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format('hh:mm A');
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current');
      }
    }
  });
}

updateStatus(order);
initStripe();

// Socket setup
let socket = io();

// Join
if (order) {
  socket.emit('join', `order_${order._id}`);
}
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
  initAdmin(socket);
  socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: 'success',
    timeout: 1000,
    text: 'Order updated',
    progressBar: false,
  }).show();
});
