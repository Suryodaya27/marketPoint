// Import necessary modules and create a router
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewear/auth')
const prisma = new PrismaClient();

// Endpoint to get the total cart price for a user
router.get('/',verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Fetch all cart items for the user
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: { select: { productPrice: true } },
      },
    });

    // Calculate the total cart price
    const totalCartPrice = cartItems.reduce((total, cartItem) => {
      return total + cartItem.product.productPrice * cartItem.productCount;
    }, 0);

    res.json({ totalCartPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve cart price.' });
  }
});

module.exports = router;
