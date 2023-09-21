const express = require('express');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.get('/', async (req,res)=>{
    try{
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    }catch(error){
        console.error('Error occurred:', error);
        res.status(500).send('An error occurred while finding products.');
    }
})

module.exports = router;