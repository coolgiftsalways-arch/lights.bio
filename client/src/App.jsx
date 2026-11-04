import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./components/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderResult from "./pages/OrderResult";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderResult success />} />
        <Route path="/order-failed" element={<OrderResult />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}