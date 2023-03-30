import { loadStripe } from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import { CardWidget } from './CardWidget';

export async function initStripe() {
  const stripe = await loadStripe(
    'pk_test_51MX43ISAviHEZo5htIL13qyNqEwXdYfaT8yqY5bRfL925k9dGy5CER6WAnCblQAN3llIM83TIuee8Kldf8Mr3ZGw00dEuIknbb'
  );
  let card = null;

  const paymentType = document.querySelector('#paymentType');
  if (!paymentType) return;

  paymentType.addEventListener('change', (e) => {
    if (e.target.value === 'card') {
      // Display Widget
      card = new CardWidget(stripe);
      card.mount();
    } else {
      card.destroy();
    }
  });

  // AJAX request
  const paymentForm = document.querySelector('#payment-form');

  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let form = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of form.entries()) {
        formObject[key] = value;
        console.log(key, value);
      }

      if (!card) {
        placeOrder(formObject); //AJAX request
        return;
      }

      const token = await card.createToken();
      formObject.stripeToken = token.id;
      placeOrder(formObject);
    });
  }
}
