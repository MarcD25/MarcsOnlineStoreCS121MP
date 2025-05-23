# Marc's Online Store 🛍️

A full-stack e-commerce application built with Next.js, Express.js, and PostgreSQL. This project demonstrates a modern web application with user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

- User authentication (login/signup)
- Product listing and management
- Shopping cart functionality with local storage persistence
- Order processing system
- Seller dashboard with real-time order tracking
- Responsive design with dark mode support
- Image upload and management for products

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework for production-grade applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **PostgreSQL**: Open-source relational database
- **JavaScript**: Core language for server-side logic and integration

### Development Tools
- **Git**: Version control system
- **npm**: Package manager for Node.js
- **pgAdmin4**: PostgreSQL administration tool

---

## 🔧 Prerequisites

1. **Node.js**: v18+ ([Download](https://nodejs.org/))
2. **PostgreSQL**: v14+ ([Download](https://www.postgresql.org/download/))
3. **Git**: Latest version ([Download](https://git-scm.com/))

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/online-store.git
cd online-store
```

2. Set up the backend:
```bash
cd store-backend
cp .env.example .env    # Copy and configure environment variables
npm run setup          # Install dependencies and set up database
```

3. Set up the frontend:
```bash
cd ../store-frontend
cp .env.example .env    # Copy and configure environment variables
npm run setup          # Install dependencies and build
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd store-backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd store-frontend
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Notes
- Ensure PostgreSQL is running and accessible via pgAdmin4.
- If you encounter issues with the database connection, verify the `DATABASE_URL` in the `.env` file and ensure the database is properly set up in pgAdmin4.
- For production, configure environment variables and use `npm run build` to build the frontend.

## 🔑 Default Account
After running the database seed, you can use the following demo account:
- **Email**: seller@store.com
- **Password**: password123


