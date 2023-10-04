// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ngrok = require('ngrok');
const app = express();


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// add prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(bodyParser.json());

// Routes
const signup = require("./routes/signup");
const signin = require("./routes/signin");
const addproducts = require("./routes/addproducts");
const getproducts = require("./routes/getProducts");
const addToCart = require("./routes/addTocart");
const getPrice = require("./routes/getPrice");
const getCart = require("./routes/getCart");
const removeFromCart = require("./routes/removeFromCart");
const increaseCartItem = require("./routes/increaseCartItem");
const decreaseCartItem = require("./routes/decreaseCartItem");
const order = require("./routes/order");

app.use("/api/signup", signup);
app.use("/api/signin", signin);
app.use("/api/add-products", addproducts);
app.use("/api/get-products", getproducts);
app.use("/api/add-to-cart", addToCart);
app.use("/api/get-price", getPrice);
app.use("/api/get-cart", getCart);
app.use("/api/remove-from-cart", removeFromCart);
app.use("/api/increase-cart-item", increaseCartItem);
app.use("/api/decrease-cart-item", decreaseCartItem);
app.use("/api/order",order);

const port = 8080;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}/`);
  // const ngrokUrl = await ngrok.connect(port);
  // console.log(`Ngrok tunnel is active at: ${ngrokUrl}`);
});
