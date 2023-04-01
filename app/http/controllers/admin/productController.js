const Product = require('../../../models/product');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 5 },
}).single('image');

function productController() {
  return {
    store(req, res) {
      res.render('admin/products');
    },

    async storeProduct(req, res) {
      handleMultipartData(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: err.message });
        }

        const filePath = req.file.path;

        const { name, price, category } = req.body;
        let document;

        try {
          document = await Product.create({
            name: name,
            price: price,
            size: category,
            image: filePath,
          });
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }

        res.redirect('/admin/products');
      });
    },
  };
}

module.exports = productController;
