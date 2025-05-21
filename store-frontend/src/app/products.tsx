"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// Define the Product type
interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  seller: {
    name: string;
  };
}

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]); // Initialize as empty array
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem, state } = useCart(); // Get cart state here
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [quantityMap, setQuantityMap] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Fetching products...');
        const response = await fetch("/api/products/");
        
        if (!response.ok) {
          console.error('Products fetch failed:', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products fetched:', data);
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    const quantity = quantityMap[product.id] || 1;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
    alert('Item added to cart!');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  const handleLogout = async () => {
    try {
      setUser(null); // Clear user state
      localStorage.clear(); // Clear all storage
      router.push('/'); // Navigate to home
      router.refresh(); // Force page refresh to update UI
      window.location.reload(); // Ensure complete reset of state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredProducts = products?.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-surface py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="font-montserrat font-bold text-xl text-primary hover:text-accent transition-colors">
            Marc's Online Store
          </a>
          <div className="flex gap-4">
            {user ? (
              user.role === 'seller' ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-primary"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={handleViewCart}
                    className="btn-secondary"
                  >
                    Cart
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-primary"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <button 
                  onClick={handleLogin}
                  className="btn-secondary"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignUp}
                  className="btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary">Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name || "Unnamed Product"}
                className="w-full h-48 object-contain rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2 text-text-primary">
                {product.name || "Unnamed Product"}
              </h2>
              <p className="text-text-secondary mb-4">
                ₱{product.price.toFixed(2)}
              </p>
              <p className="text-sm text-text-secondary mb-4">
                Seller: {product.seller.name}
              </p>
              {(user && user.role === 'buyer') && (
                <>
                  <label className="block text-text-secondary font-medium mb-2">
                    Quantity:
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantityMap[product.id] || 1}
                    onChange={(e) => 
                      setQuantityMap({ ...quantityMap, [product.id]: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-2 mb-4 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary w-full"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
