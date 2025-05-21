"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface Receipt {
  orderId: number;
  items: ReceiptItem[];
  total: number;
  date: string;
}

export default function Receipt() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const router = useRouter();

  useEffect(() => {
    const receiptData = localStorage.getItem('lastOrder');
    if (receiptData) {
      setReceipt(JSON.parse(receiptData));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!receipt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading receipt...</div>
      </div>
    );
  }

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
        </div>
      </nav>

      <div className="container mx-auto px-6">
        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Order Confirmation</h1>
            <p className="text-text-secondary">Thank you for your purchase!</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-text-secondary text-sm mb-2">
              <span>Order #{receipt.orderId}</span>
              <span>{receipt.date}</span>
            </div>
            <hr className="border-border mb-6" />
            
            <div className="space-y-4">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-text-primary">{item.name}</h3>
                    <p className="text-sm text-text-secondary">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-text-primary font-medium">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border mb-6" />
          
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-semibold text-text-primary">Total</span>
            <span className="text-2xl font-bold text-primary">₱{receipt.total.toFixed(2)}</span>
          </div>

          <div className="text-center">
            <Link href="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
