// Import necessary modules and create a router
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewear/auth')
const prisma = new PrismaClient();

// Endpoint to increase the quantity of an item in the cart
router.put('/',verifyToken, async (req, res) => {
    const {cartItemId} = req.body;

    try {
      // Check if the cart item exists
      const cartItem = await prisma.cart.findUnique({
        where: { cartId: cartItemId },
      });
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found.' });
      }
  
      // Increase the productCount for the cart item
      const updatedCartItem = await prisma.cart.update({
        where: { cartId: cartItemId },
        data: {
          productCount: cartItem.productCount + 1,
        },
      });
  
      res.json(updatedCartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to increase item quantity in cart.' });
    }
  });
  
  module.exports = router;