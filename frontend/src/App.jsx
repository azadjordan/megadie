import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AccountDashboard from "./pages/account/AccountDashboard";
import AdminRoute from "./components/AdminRoute";
import OrderList from "./pages/OrderList";
import ProductList from "./pages/ProductList";
import UserList from "./pages/UserList";
import PaymentList from "./pages/PaymentList";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PaymentUpdate from "./pages/PaymentUpdate.jsx";
import Shop from "./pages/Shop";
import CategoryList from "./pages/CategoryList";
import CategoryUpdate from "./pages/CategoryUpdate";
import QuoteList from "./pages/QuoteList";
import InvoiceList from "./pages/InvoiceList";
import AdminHeader from "./components/AdminHeader"; // ✅ Admin Navigation
import ProductUpdate from "./pages/ProductUpdate.jsx";
import UserUpdate from "./pages/UserUpdate.jsx";
import QuoteSuccess from "./pages/QuoteSuccess.jsx";
import QuoteUpdate from "./pages/QuoteUpdate.jsx";
import UserProfile from "./pages/account/UserProfile.jsx";
import UserRequests from "./pages/account/UserRequests.jsx";
import UserOrders from "./pages/account/UserOrders.jsx";
import UserInvoices from "./pages/account/UserInvoices.jsx";
import UserPayments from "./pages/account/UserPayments.jsx";
import UserOrder from "./pages/account/UserOrder.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import OrderUpdate from "./pages/OrderUpdate.jsx";
import PaymentAdd from "./pages/PaymentAdd.jsx";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ ToastContainer placed above everything */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
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
      <AdminHeader />

      <main className="container mx-auto flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Product />} />

          <Route element={<PrivateRoute />}>
            <Route path="/account" element={<AccountDashboard />}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="requests" element={<UserRequests />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="orders/:id" element={<UserOrder />} />
              <Route path="invoices" element={<UserInvoices />} />
              <Route path="payments/my" element={<UserPayments />} />
            </Route>
            <Route path="quotes/quote-success" element={<QuoteSuccess />} />
          </Route>

          {/* ✅ Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/orders/:id/edit" element={<OrderUpdate />} />
            <Route path="/admin/orders/:id" element={<OrderDetails />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route
              path="/admin/products/:id/edit"
              element={<ProductUpdate />}
            />
            <Route path="/admin/categories" element={<CategoryList />} />
            <Route
              path="/admin/categories/:id/edit"
              element={<CategoryUpdate />}
            />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/users/:id/edit" element={<UserUpdate />} />

            <Route path="/admin/quotes" element={<QuoteList />} />
            <Route path="/admin/quotes/:id/edit" element={<QuoteUpdate />} />
            <Route path="/admin/invoices" element={<InvoiceList />} />
            <Route path="/admin/payments" element={<PaymentList />} />
            <Route path="/admin/invoices/:id/payment" element={<PaymentAdd />} />
            <Route
              path="/admin/payments/:id/edit"
              element={<PaymentUpdate />}
            />
          </Route>
        </Routes>
      </main>
      <ScrollToTopButton />

      <Footer />
    </div>
  );
};

export default App;
