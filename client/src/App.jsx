import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./components/Products";
import Cart from "./pages/cart";
import Checkout from "./pages/Checkout";
import OrderResult from "./pages/OrderResult";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AdminOrders from "./admin/Orders";
import AdminProducts from "./admin/Products";
import Subscribers from "./admin/Subscribers";

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderResult success />} />
        <Route path="/order-failed" element={<OrderResult />} />

        {/* Admin panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="subscribers" element={<Subscribers />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
