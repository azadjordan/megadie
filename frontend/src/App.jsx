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
import User from "./pages/User"; // ✅ Import User Edit Page
import EditOrderPrices from "./pages/EditOrderPrices"; // ✅ Import EditOrderPrices
import OrderDetailsUser from "./pages/OrderDetailsUser";
import MyPayments from "./pages/MyPayments";
import PaymentList from "./pages/PaymentList";
import CreatePayment from "./pages/CreatePayment";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-[60px]">
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
              <Route path="orders/:id" element={<OrderDetailsUser />} />{" "}
              <Route path="/account/payments" element={<MyPayments />} />
            </Route>
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
          </Route>

          {/* ✅ Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/product/edit/:id" element={<ProductEdit />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/user/:id" element={<User/>} />
            <Route
              path="/admin/order/edit-prices/:orderId"
              element={<EditOrderPrices />}
            />
            <Route path="/admin/payments" element={<PaymentList />} />
            <Route path="/admin/payments/create" element={<CreatePayment />} />
           
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
