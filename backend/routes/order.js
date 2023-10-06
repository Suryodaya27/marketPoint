// const express = require("express");
// const router = express.Router();
// const { PrismaClient } = require("@prisma/client");
// const verifyToken = require("../middlewear/auth");
// const Razorpay = require('razorpay');
// const prisma = new PrismaClient();

// const razorpay = new Razorpay({
//   key_id: "rzp_test_kjsYBjby3JFQfa",
//   key_secret: "xc4ik82PrWT811lUy2K4Yff4",
// });

// router.post("/", verifyToken, async (req, res) => {
//   const userId = req.userId;
//   const cartItems = req.body.cartItems;     // Include cart items in the request body
//   const totalPrice = parseFloat(req.body.totalPrice); // Include total price in the request body
//   const orderStatus = 'Pending'; // Set the initial order status

//   try {
//     // Create a Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: totalPrice * 100, // Amount should be in paise (multiply by 100)
//       currency: 'INR',          // Currency code (e.g., 'INR' for Indian Rupees)
//     });

//     // Create a new order with Razorpay order ID and status
//     const newOrder = await prisma.order.create({
//       data: {
//         userId,
//         totalAmount: totalPrice,
//         status: orderStatus,        // Set the initial order status
//         razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID in your order
//         orderItem: {
//           create: cartItems.map((item) => ({
//             productId: item.productId,
//             quantity: item.productCount,
//           })),
//         },
//       },
//     });

//     // Clear the user's cart
//     await prisma.cart.deleteMany({
//       where: {
//         userId,
//       },
//     });

//     // Return the Razorpay order details to the frontend
//     res.status(201).json({
//       order: newOrder,
//       razorpayOrder: razorpayOrder,
//     });
//   } catch (error) {
//     console.error('Error placing order with Razorpay integration:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewear/auth");
const Razorpay = require('razorpay');
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: "rzp_test_kjsYBjby3JFQfa",
  key_secret: "xc4ik82PrWT811lUy2K4Yff4",
});

router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const cartItems = req.body.cartItems;     // Include cart items in the request body
  const totalPrice = parseFloat(req.body.totalPrice); // Include total price in the request body
  const orderStatus = 'Pending'; // Set the initial order status

  try {
    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // Amount should be in paise (multiply by 100)
      currency: 'INR',          // Currency code (e.g., 'INR' for Indian Rupees)
    });

    // Create a new order with Razorpay order ID and status
    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount: totalPrice,
        status: orderStatus,        // Set the initial order status
        razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID in your order
        // Order items will be associated with the order later when handling the webhook
      },
    });

    // Return the Razorpay order details to the frontend
    res.status(201).json({
      order: newOrder,
      razorpayOrder: razorpayOrder,
    });
  } catch (error) {
    console.error('Error placing order with Razorpay integration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

