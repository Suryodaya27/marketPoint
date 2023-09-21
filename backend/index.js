// imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Configure your routes and middleware here

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());



// add prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(bodyParser.json());

// Routes
const signup = require('./routes/signup');
const signin = require('./routes/signin');
const addproducts = require('./routes/addproducts');
const getproducts = require('./routes/getProducts');
const addToCart = require('./routes/addTocart');
const getPrice = require('./routes/getPrice')

app.use('/api/signup' , signup);
app.use('/api/signin', signin);
app.use('/api/add-products', addproducts);
app.use('/api/get-products', getproducts);
app.use('/api/add-to-cart',addToCart);
app.use('/api/get-price', getPrice);

const port = 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});