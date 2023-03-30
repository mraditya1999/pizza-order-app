export class CardWidget {
  stripe = null;
  card = null;
  style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };

  constructor(stripe) {
    this.stripe = stripe;
  }

  mount() {
    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      style: this.style,
      hidePostalCode: true,
    });
    this.card.mount('#card-element');
  }

  destroy() {
    this.card.destroy();
  }

  async createToken() {
    try {
      const { token, error } = await this.stripe.createToken(this.card);
      if (error) {
        throw new Error(error.message);
      }
      return token;
    } catch (err) {
      new Noty({
        type: 'error',
        text: err.message,
        timeout: 1000,
        progressBar: false,
        layout: 'topLeft',
      }).show();
    }
  }
}
