const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Route to fetch all products - Fix the route path
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all products');
    const products = await prisma.product.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get seller's products
router.get('/seller/:sellerId', async (req, res) => {
  try {
    console.log('Fetching products for seller:', req.params.sellerId);
    const products = await prisma.product.findMany({
      where: { sellerId: parseInt(req.params.sellerId) },
      include: {},
    });
    console.log('Found products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product - update route
router.post('/', async (req, res) => {
  try {
    console.log('Creating product:', req.body);
    const { name, price, sellerId, image } = req.body;

    if (!name || !price || !sellerId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { name, price, sellerId }
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        image: image || null,
        price: parseFloat(price),
        sellerId: parseInt(sellerId)
      }
    });

    console.log('Product created:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      error: 'Failed to create product',
      details: error.message 
    });
  }
});

// Update product route
router.put('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const { name, price, image } = req.body; // removed stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        image: image || null,
        price: parseFloat(price)
      }
    });
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    console.log('Deleting product:', productId);
    
    await prisma.product.delete({
      where: { id: productId }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.code === 'P2003') {
      res.status(409).json({ 
        error: 'Product is referenced by existing orders. Remove them first.',
      });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(500).json({ 
        error: 'Failed to delete product',
        details: error.message 
      });
    }
  }
});

module.exports = router;
