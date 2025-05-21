"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  stock: number;
}

interface Order {
  id: number;
  createdAt: string;
  total: number;
  items: Array<{
    quantity: number;
    product: Product;
  }>;
  user: {
    name: string;
    email: string;
  };
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.clear(); // Clear all storage instead of just removing 'user'
      await router.push('/'); // Wait for navigation to complete
      router.refresh(); // Force a refresh of the page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id || user.role !== 'seller') {
        router.push('/login');
        return;
      }

      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:3000/api/products/seller/${user.id}`),
          fetch(`http://localhost:3000/api/orders/seller/${user.id}`)
        ]);

        if (productsRes.ok && ordersRes.ok) {
          const productsData = await productsRes.json();
          console.log('Fetched products:', productsData);
          setProducts(productsData);
          setOrders(await ordersRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProductAction = async (action: 'add' | 'edit' | 'delete', product: Partial<Product>) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      alert('You must be logged in to perform this action');
      return;
    }
  
    try {
      const productData = {
        ...product,
        sellerId: user.id,
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0
      };
  
      const method = action === 'add' ? 'POST' : action === 'edit' ? 'PUT' : 'DELETE';
      const baseUrl = 'http://localhost:3000/api/products';
      const url = action === 'add' ? baseUrl : `${baseUrl}/${product.id}`;
  
      console.log(`${action.toUpperCase()} product:`, { url, productData });
  
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify(productData) : null
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server response:', errorText);
        throw new Error(errorText);
      }
  
      const data = await res.json();
      console.log('Success:', data);
      await refreshProducts(user.id);
    } catch (error) {
      console.error(`${action} product error:`, error);
      alert(error instanceof Error ? error.message : 'Failed to perform action');
    }
  };

  const refreshProducts = async (userId: number) => {
    const res = await fetch(`http://localhost:3000/api/products/seller/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
      setShowProductForm(false);
      setEditingProduct({});
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingProduct.id ? 'edit' : 'add';
    await handleProductAction(action, editingProduct);
    setShowProductForm(false);
    setEditingProduct({});
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-text-primary">Seller Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="btn-secondary"
            >
              View Store
            </button>
            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Products Management */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-text-primary">Your Products</h2>
              <button
                onClick={() => {
                  setEditingProduct({});
                  setShowProductForm(true);
                }}
                className="btn-primary"
              >
                Add Product
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="mb-8 p-6 bg-surface rounded-lg">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={editingProduct.name || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 mb-4 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary w-full mb-4"
                >
                  Select Image
                </button>
                {editingProduct.image && (
                  <img
                    src={editingProduct.image}
                    alt="Selected"
                    className="w-full h-40 object-contain rounded-lg mb-4"
                  />
                )}
                <input
                  type="number"
                  placeholder="Price"
                  value={editingProduct.price || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 mb-4 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct({});
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingProduct.id ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="p-4 bg-surface rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-contain rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-text-primary">{product.name}</h3>
                        <p className="text-text-secondary">₱{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                        className="text-primary hover:text-accent"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleProductAction('delete', product)}
                        className="text-error hover:text-error/80"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Overview */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Sales Overview</h2>
            <div className="space-y-4">
              {orders
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((order, idx, allOrders) => {
                  const latestItem = order.items[order.items.length - 1];
                  const orderNumber = allOrders.length - idx;

                  return (
                    <div key={order.id} className="p-4 bg-surface rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-text-primary">Order #{orderNumber}</p>
                          <p className="text-sm text-text-secondary">Customer: {order.user.name}</p>
                          <p className="text-sm text-text-secondary">
                            Ordered on: {new Date(order.createdAt).toLocaleString()}
                          </p>
                            {order.items && (
                              <>
                                <p className="text-sm text-text-secondary">Product/s:</p>
                                {order.items.map((item, index) => (
                                  <p key={index} className="text-sm text-text-secondary">
                                    - {item.product.name} (Qty: {item.quantity})
                                  </p>
                                ))}
                              </>
                            )}
                          </div>
                        <p className="font-semibold text-primary">₱{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
