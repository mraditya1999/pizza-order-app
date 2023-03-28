const Order = require('../../../models/order');

function orderController() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: 'completed' } }, null, {
        sort: { createdAt: -1 },
      })
        .populate('customerId', '-password -createdAt -updatedAt')
        .then((orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render('admin/orders');
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: 'Server error' });
        });
    },
  };
}

module.exports = orderController;
