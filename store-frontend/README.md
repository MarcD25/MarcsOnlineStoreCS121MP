# Online Store Frontend

Modern e-commerce frontend built with Next.js and TypeScript.

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- Context API for state management
- Custom dark mode theme
- Responsive design

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Build the application:
```bash
npm run build
```

## 🚀 Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📱 Features

- User authentication (login/signup)
- Product browsing and search
- Shopping cart with local storage persistence
- Order processing and receipt generation
- Seller dashboard with product management
- Responsive design for mobile and desktop
- Dark mode support

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run setup`: Complete setup (install & build)
- `npm run clean`: Clean build files and dependencies

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── cart/        # Shopping cart page
│   ├── dashboard/   # Seller dashboard
│   ├── login/       # Authentication pages
│   ├── products/    # Product listing
│   └── receipt/     # Order receipt
├── context/         # React Context providers
└── components/      # Shared components
```

## 🎨 Styling

The project uses TailwindCSS with a custom theme defined in `globals.css`. The theme includes:

- Light and dark mode support
- Custom color palette
- Responsive design utilities
- Custom component classes

## 📚 State Management

- Shopping cart state is managed using Context API
- Cart data persists in localStorage
- User authentication state is managed through localStorage

## 🔒 Security

- Environment variables for sensitive data
- Form validation and sanitization
- Protected routes for authenticated users
- CORS configuration for API requests
