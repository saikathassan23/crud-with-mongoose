const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

const mongoDBConnection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('db connected');
  } catch (error) {
    console.log(error.message);
  }
};

// schema design

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// model design
const productModel = mongoose.model('products', productSchema);

app.get('/', (req, res) => {
  res.send('Welcome to mongoose server');
});

app.post('/products', async (req, res) => {
  try {
    // const { title, price, description } = req.body;

    // save to mongodb
    const newProduct = new productModel({ ...req.body });

    const savedProduct = await newProduct.save();

    res.status(200).send(savedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/products', async (req, res) => {
  try {
    const prod = await productModel.find();
    res.send(prod);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const prod = await productModel.find({ _id: id });
    res.send(prod);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.put('/products', async (req, res) => {
  try {
    const prod = await productModel.updateOne(
      { title: 'IPhone 14' },
      { $set: { title: 'iPhone 14 pro' } }
    );
    res.send(prod);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, async () => {
  console.log('listening on port http://localhost:' + port);
  await mongoDBConnection();
});
