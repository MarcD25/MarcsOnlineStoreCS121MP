const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get seller's orders
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const sellerId = parseInt(req.params.sellerId);
    // Find all orders that have at least one item from the seller
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { sellerId }
          }
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    // For each order, filter items to only include those from the specified seller and recalc total
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => item.product.sellerId === sellerId);
      const sellerTotal = sellerItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return {
        ...order,
        items: sellerItems,
        total: sellerTotal
      };
    });
    
    res.json(sellerOrders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  console.log('Order request received:', req.body);
  
  try {
    const { userId, items, total } = req.body;

    if (!userId || !items?.length || total === undefined) {
      console.log('Invalid order data:', { userId, items, total });
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Create order with explicit type conversion
    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        total: Number(total),
        items: {
          create: items.map(item => ({
            quantity: Number(item.quantity),
            product: {
              connect: { id: Number(item.productId) }
            }
          }))
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    console.log('Order created:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

module.exports = router;
