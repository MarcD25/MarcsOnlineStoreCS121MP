"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Cart() {
  const { state, removeItem, clearCart, updateItem } = useCart();
  const router = useRouter();
  const [checkoutError, setCheckoutError] = useState("");

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setCheckoutError("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      router.push("/login");
      return;
    }

    try {
      const orderData = {
        userId: Number(user.id),
        items: state.items.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        total: Number(total.toFixed(2))
      };

      console.log('Sending order:', orderData);

      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Server response:', text);
        throw new Error(text.includes('<!DOCTYPE') ? 'Server error' : text);
      }

      const data = await res.json();
      console.log('Order created:', data);

      const receiptData = {
        orderId: data.id,
        items: state.items.map(item => ({
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        total: Number(total.toFixed(2)),
        date: new Date().toLocaleString()
      };

      localStorage.setItem("lastOrder", JSON.stringify(receiptData));
      clearCart();
      router.push("/receipt");
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(
        error instanceof Error ? error.message : "Failed to process order"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface py-4 px-6 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 btn-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Store</span>
          </Link>
          <button
            onClick={clearCart}
            className="btn-secondary"
          >
            Clear Cart
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-text-primary">Shopping Cart</h1>
        {checkoutError && (
          <div className="mb-6 p-4 bg-error/10 text-error rounded-lg">
            {checkoutError}
          </div>
        )}
        <div className="card">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-secondary mb-4">Your cart is empty</p>
              <Link href="/products" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg text-text-primary mb-2">{item.name}</h3>
                      <div className="flex items-center gap-4">
                        <label className="text-text-secondary">Quantity:</label>
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 rounded border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-lg font-medium text-text-primary">₱{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => {
                          try {
                            removeItem(item.id);
                          } catch (err) {
                            console.error("Error removing item:", err);
                          }
                        }}
                        className="text-error hover:text-error/80 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-6 pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-surface p-4 rounded-lg">
                  <span className="text-xl font-semibold text-text-primary mb-2 sm:mb-0">Total:</span>
                  <span className="text-2xl font-bold text-primary">₱{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-3 text-lg font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
