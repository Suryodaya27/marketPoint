// Import necessary modules and create a router
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewear/auth')
const prisma = new PrismaClient();

// Endpoint to decrease the quantity of an item in the cart
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
  
      // Ensure that the product count doesn't go below 1
      const newProductCount = Math.max(cartItem.productCount - 1, 1);
  
      // Decrease the productCount for the cart item
      const updatedCartItem = await prisma.cart.update({
        where: { cartId: cartItemId },
        data: {
          productCount: newProductCount,
        },
      });
  
      res.json(updatedCartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to decrease item quantity in cart.' });
    }
  });

  
  module.exports = router