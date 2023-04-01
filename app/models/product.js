const mongoose = require('mongoose');
const { APP_URL } = '../config';
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    description: { type: String, default: 'description here...' },
    // image: { type: String, required: true },
    image: {
      type: String,
      required: true,
      get: (imagePath) => {
        // http://localhost:5000/uploads/1679721462873-559122228.png
        return `${APP_URL}/${imagePath}`;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

module.exports = mongoose.model('Product', productSchema, 'products');
