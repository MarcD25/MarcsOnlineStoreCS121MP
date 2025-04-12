const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Upsert default seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@store.com' },
    update: {},
    create: {
      email: 'seller@store.com',
      password: 'password123',
      name: 'X & Y',
      role: 'seller',
    },
  });

  // Upsert products without category and stock
  const products = await Promise.all([
    prisma.product.upsert({
      where: { name: 'Laptop' },
      update: {
        image: '/images/laptop.png',
        price: 999.99,
        sellerId: seller.id
      },
      create: {
        name: 'Laptop',
        image: '/images/laptop.png',
        price: 999.99,
        seller: { connect: { id: seller.id } }
      },
    }),
    prisma.product.upsert({
      where: { name: 'Smartphone' },
      update: {
        image: '/images/smartphone.png',
        price: 699.99,
        sellerId: seller.id
      },
      create: {
        name: 'Smartphone',
        image: '/images/smartphone.png',
        price: 699.99,
        seller: { connect: { id: seller.id } }
      },
    }),
    prisma.product.upsert({
      where: { name: 'Programming Book' },
      update: {
        image: '/images/book.png',
        price: 29.99,
        sellerId: seller.id
      },
      create: {
        name: 'Programming Book',
        image: '/images/book.png',
        price: 29.99,
        seller: { connect: { id: seller.id } }
      },
    }),
    prisma.product.upsert({
      where: { name: 'T-Shirt' },
      update: {
        image: '/images/tshirt.jpg',
        price: 19.99,
        sellerId: seller.id
      },
      create: {
        name: 'T-Shirt',
        image: '/images/tshirt.jpg',
        price: 19.99,
        seller: { connect: { id: seller.id } }
      },
    }),
  ]);

  console.log('Database seeded with:', {
    seller: seller.id,
    products: products.map(p => p.id)
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
