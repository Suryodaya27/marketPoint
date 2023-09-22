const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();

const prisma = new PrismaClient();
const router = express.Router();
app.use(express.json());

const verifyToken = require("../middlewear/auth");

router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const { productId, productCount } = req.body;

  try {
    // Check if the product and user exist in your database
    const product = await prisma.product.findUnique({
      where: { productId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!product || !user) {
      return res.status(404).json({ error: "Product or user not found." });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          productCount: existingCartItem.productCount + productCount,
        },
      });

      // Decrease productCount from productQuantity
      await prisma.product.update({
        where: { productId },
        data: {
          productQuantity: product.productQuantity - productCount,
        },
      });

      res.json(updatedCartItem);
    } else {
      // If the product is not in the cart, create a new cart item
      const cartItem = await prisma.cart.create({
        data: {
          productId,
          userId,
          productCount,
        },
      });

      // Decrease productCount from productQuantity
      await prisma.product.update({
        where: { productId },
        data: {
          productQuantity: product.productQuantity - productCount,
        },
      });

      res.json(cartItem);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add item to cart." });
  }
});

module.exports = router;
