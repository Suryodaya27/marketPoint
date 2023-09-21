const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();


const prisma = new PrismaClient();
const router = express.Router();
app.use(express.json());

// POST endpoint to add multiple products to the database
router.post('/', async (req, res) => {
  try {
    const products = req.body;

    // Create multiple products in the database
    const createdProducts = await prisma.product.createMany({
      data: products,
    });

    res.status(201).json(createdProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router