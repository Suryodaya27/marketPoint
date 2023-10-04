const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewear/auth");
const prisma = new PrismaClient();

router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const { cartItems } = req.body;

    // Calculate the total amount based on the cart items and their counts
    const totalAmount = calculateTotalAmount(cartItems);

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "Pending", // Set the initial status as needed
      },
    });

    // Create an array of order items with product details and counts
    const orderItems = [];
    for (const cartItem of cartItems) {
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: cartItem.product.productId,
          quantity: cartItem.productCount,
          // Add other fields as needed
        },
      });
      orderItems.push({
        product: cartItem.product, // Product details
        quantity: cartItem.productCount, // Product count from cart
        // Add other fields as needed
      });
    }

    res.status(201).json({
      order: order,
      orderItems: orderItems,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
