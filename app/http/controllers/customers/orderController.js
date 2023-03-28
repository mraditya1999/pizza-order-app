const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
  return {
    store(req, res) {
      // validate request
      const { phone, address } = req.body;

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });

      order.save().then(async (result) => {
        const placedOrder = await Order.populate(result, {
          path: 'customerId',
        });
        req.flash('success', 'Order placed successfully');
        delete req.session.cart;
        // Emit
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('orderPlaced', placedOrder);
        return res.redirect('/customer/orders');
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
        // .populate('customerId','-password -createdAt -updatedAt');
        if (req.xhr) {
          return res.json(order);
        } else {
          return res.render('customers/singleOrder', { order });
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    },
  };
}

module.exports = orderController;
