import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop"; // ✅ Import Shop Page
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PlaceOrder from "./pages/PlaceOrder";
import PrivateRoute from "./components/PrivateRoute";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetails";
import AccountDashboard from "./pages/AccountDashboard";
import MyOrders from "./pages/MyOrders";
import AdminRoute from "./components/AdminRoute";
import OrderList from "./pages/OrderList";
import ProductList from "./pages/ProductList";
import ProductEdit from "./pages/ProductEdit";
import UserList from "./pages/UserList"; // ✅ Import User List Page
import UserEdit from "./pages/UserEdit"; // ✅ Import User Edit Page

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ ToastContainer placed above everything */}
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Header />

      <main className="container mx-auto flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Product />} />

          <Route element={<PrivateRoute />}>
            <Route path="/account" element={<AccountDashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<MyOrders />} />
            </Route>
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Route>

          {/* ✅ Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/product/edit/:id" element={<ProductEdit />} />
            <Route path="/admin/users" element={<UserList />} /> 
            <Route path="/admin/user/edit/:id" element={<UserEdit />} /> 
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
