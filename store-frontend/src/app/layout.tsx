import type { Metadata } from "next";
import "@fontsource/montserrat/700.css"; // Bold for H1-H3
import "@fontsource/montserrat/600.css"; // SemiBold for H4-H6
import "@fontsource/open-sans/400.css"; // Regular
import "@fontsource/open-sans/600.css"; // SemiBold
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Marc's Online Store",
  description: "Shop online at Marc's Online Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
