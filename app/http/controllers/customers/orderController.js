const moment = require('moment');
const Order = require('../../../models/order');
const STRIPE_PRIVATE_KEY =
  'sk_test_51MX43ISAviHEZo5hcGN81CfIqm3O7PXoyGreOKxeynCjxoccYnufXEEQkDovVCUkJ7SFRGjOX2sy24prWIrtIDZs009trng2pE';
const stripe = require('stripe')(STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    async store(req, res) {
      // Validate request
      const { phone, address, stripeToken, paymentType } = req.body;
      if (!phone || !address) {
        return res.status(422).json({ message: 'All fields are required' });
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: 'customerId' }).then((placedOrder) => {
            // Stripe payment
            if (paymentType === 'card') {
              // Create a payment intent
              stripe.paymentIntents
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  currency: 'inr',
                  payment_method_types: ['card'],
                  payment_method_data: {
                    type: 'card',
                    card: {
                      token: stripeToken,
                    },
                  },
                  description: `Pizza order: ${placedOrder._id}`,
                })
                .then((paymentIntent) => {
                  // Confirm the payment intent
                  stripe.paymentIntents
                    .confirm(paymentIntent.id)
                    .then(() => {
                      placedOrder.paymentStatus = true;
                      placedOrder.paymentType = paymentType;
                      placedOrder
                        .save()
                        .then((ord) => {
                          // Emit
                          const eventEmitter = req.app.get('eventEmitter');
                          eventEmitter.emit('orderPlaced', ord);
                          delete req.session.cart;
                          return res.json({
                            message:
                              'Payment successful, Order placed successfully',
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      delete req.session.cart;
                      return res.json({
                        message:
                          'Order placed but payment failed, You can pay at delivery time',
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  delete req.session.cart;
                  return res.json({
                    message:
                      'Order placed but payment failed, You can pay at delivery time',
                  });
                });
            } else {
              delete req.session.cart;
              return res.json({ message: 'Order placed succesfully' });
            }
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: 'Something went wrong' });
        });
    },

    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        'Cache-Control',
        'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0'
      );
      return res.render('customers/orders', { orders: orders, moment: moment });
    },

    async show(req, res) {
      try {
        const order = await Order.findById(req.params.id);
        if (req.user._id.toString() === order.customerId.toString()) {
          return res.render('customers/singleOrder', { order: order });
        }
        return res.render('/', { order });
      } catch (err) {
        return res.status(500).json({ error: 'Server error' });
      }
    },
  };
}

module.exports = orderController;
