// Import necessary modules and create a router
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewear/auth')
const prisma = new PrismaClient();
// Endpoint to get the user's cart items
router.get('/',verifyToken, async (req, res) => {
    const userId =req.userId;
  
    try {
      // Fetch all cart items for the user, including product details
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              productId: true,
              productName: true,
              productCategory: true,
              productDescription: true,
              productPrice: true,
              productQuantity: true,
              productImage: true,
            },
          },
        },
      });
  
      res.json(cartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve cart items.' });
    }
  });
  
  module.exports = router