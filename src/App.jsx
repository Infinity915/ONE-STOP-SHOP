import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./assets/Header";
import Signout from "./assets/Signout";
import Home from "./assets/Home";
import Signup from "./assets/Signup";
import Signin from "./assets/Signin";
import Forgotpass from "./assets/Forgotpass";
import Cart from "./assets/Cart";
import Checkout from "./assets/Checkout";
import Privateroute from "./assets/Privateroute";
import Adminroute from "./assets/Adminroute";
import OrderConfirmation from "./assets/OrderConfirmation"; 

// User & Admin Pages
import Dashboard from "./assets/user/Dashboard";
import AdminDashboard from "./assets/admin/AdminDashboard";
import Createcategory from "./assets/admin/Createcategory";
import Createproduct from "./assets/admin/Createproduct";
import Orders from "./assets/user/Orders";
import Profile from "./assets/user/Profile";
import Userman from "./assets/admin/Userman";

// Context
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signout" element={<Signout />} />
        <Route path="/Forgotpassword" element={<Forgotpass />} />

        {/* Order Confirmation Route */}
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        {/* Private Routes */}
        <Route path="/Cart" element={<Privateroute><Cart /></Privateroute>} />
        <Route path="/checkout" element={<Privateroute><Checkout /></Privateroute>} />
        <Route path="/dashboard" element={<Privateroute><Dashboard /></Privateroute>} />
        <Route path="/dashboard/user/orders" element={<Privateroute><Orders /></Privateroute>} />
        <Route path="/dashboard/user/profile" element={<Privateroute><Profile /></Privateroute>} />

        {/* Admin Routes */}
        <Route element={<Adminroute />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/create-category" element={<Createcategory />} />
          <Route path="/dashboard/admin/create-product" element={<Createproduct />} />
          <Route path="/dashboard/admin/user" element={<Userman />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
