const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');

// Initialize Razorpay with your API Key and Secret
const razorpay = new Razorpay({
    key_id: "rzp_test_kjsYBjby3JFQfa",
    key_secret: "xc4ik82PrWT811lUy2K4Yff4",
  });

// Handle Razorpay webhook events
router.post('/', async (req, res) => {
  console.log("webhook reached....")
    const secret = 'imsurya'; // Replace with your webhook secret
    const payload = req.body;
    const signature = req.headers['x-razorpay-signature'];
  
    try {
      // Verify the webhook signature
      const isValidSignature = razorpay.webhooks.verify(payload, signature, secret);
  
      if (isValidSignature) {
        const event = payload.event;
        const razorpayOrderId = payload.payload.order.entity.id; // Get the Razorpay order ID
  
        // Look up the corresponding internal order by razorpayOrderId
        const internalOrder = await prisma.order.findUnique({
          where: {
            razorpayOrderId,
          },
        });
  
        if (!internalOrder) {
          console.error('Internal order not found for Razorpay order:', razorpayOrderId);
          res.status(400).send('Invalid Razorpay order');
          return;
        }
  
        // Handle the payment.captured event
        if (event === 'payment.captured') {
          // Fetch cart items associated with the user
          const userId = internalOrder.userId;
          const cartItems = await prisma.cart.findMany({
            where: {
              userId,
            },
            include: {
              product: true,
            },
          });
  
          // Create order items from cart items
          const orderItems = cartItems.map((cartItem) => ({
            productId: cartItem.productId,
            quantity: cartItem.productCount,
          }));
  
          // Update the status of the internal order to 'Paid'
          await prisma.order.update({
            where: {
              orderId: internalOrder.orderId,
            },
            data: {
              status: 'Paid',
              orderItem: {
                createMany: {
                  data: orderItems,
                },
              },
            },
          });
  
          // You can perform additional actions here, such as sending order confirmation emails
  
          // Respond to the webhook with a success status
          res.status(200).send('Webhook received and processed');
        } else {
          // Handle other Razorpay webhook events if needed
          res.status(200).send('Webhook event handled');
        }
      } else {
        // Invalid signature
        res.status(400).send('Invalid webhook signature');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
