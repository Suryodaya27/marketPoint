// Import necessary modules and create a router
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewear/auth')
const prisma = new PrismaClient();

// Endpoint to remove an item from the cart
router.delete('/',verifyToken, async (req, res) => {
    const {cartItemId} = req.body;
  
    try {
      // Check if the cart item exists
      const cartItem = await prisma.cart.findUnique({
        where: { cartId: cartItemId },
      });
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found.' });
      }
  
      // Retrieve the product associated with the cart item
      const product = await prisma.product.findUnique({
        where: { productId: cartItem.productId },
      });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // Increase the productCount in the product inventory
      await prisma.product.update({
        where: { productId: product.productId },
        data: {
          productQuantity: product.productQuantity + cartItem.productCount,
        },
      });
  
      // Delete the cart item from the database
      await prisma.cart.delete({
        where: { cartId: cartItemId },
      });
  
      res.json({ message: 'Item removed from cart successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to remove item from cart.' });
    }
  });
  
  module.exports = router