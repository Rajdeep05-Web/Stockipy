import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

// Components
// import NavbarSidebar from "./components/useful/navbarSidebar";
import Loading from "./components/useful/Loading/loading";
import Dashboard from "./components/dashboard";
import AddProduct from "./components/products/addProduct";
import ProductList from "./components/products/productList";
import UpdateProduct from "./components/products/updateProduct";
import AddCustomer from "./components/customer/addCustomer";
import UpdateCustomer from "./components/customer/updateCustomer";
import CustomerList from "./components/customer/customerList";
import AddVendor from "./components/vendor/addvendor";
import VendorList from "./components/vendor/vendorList";
import UpdateVendor from "./components/vendor/updateVendor";
import AddStockIn from "./components/stock/addStockIn";
import AllStockIns from "./components/stock/allStockIns";
import UpdateStockIn from "./components/stock/updateStockIn";
import AuthForm from "./components/user/auth";
import Layout from "./components/layout";
import LandingPage from "./components/landingPage/landingPage";
import ProfilePage from "./components/user/profilePage";
import AccountSettings from "./components/user/accountSetting";
import {PasswordResetFlow} from './components/user/passwordResetFlow';
import {EmptyInputGroup} from "./components/UI/emptyInputGroup";
import ProductDetail from "./components/products/productDetail";
import CustomerDetail from "./components/customer/customerDetail";
import VendorDetail from "./components/vendor/vendorDetail";
import AddStockOut from "./components/stock/addStockOut";

// Redux Actions
import { fetchProducts } from "./redux/slices/products/productsSlice";
import { fetchCustomers } from "./redux/slices/customers/customersSlice";
import { fetchVendors } from "./redux/slices/vendor/vendorsSlice";
import { fetchStockIns } from "./redux/slices/stock/stockInSlice";
import { Contact, Cookie } from "lucide-react";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [userLoggedIn, setUserLoggedIn] = useState(!!localStorage.getItem("token"));
  const { loading: productsLoading } = useSelector((state) => state.products);
  const { loading: customersLoading } = useSelector((state) => state.customers);
  const { loading: vendorsLoading } = useSelector((state) => state.vendors);
  const { loading: stockInsLoading } = useSelector((state) => state.stockIns);

  useEffect(() => {
    //check if user is logged in or expired
    (localStorage.getItem("token") && localStorage.getItem("user")) ? setUserLoggedIn(true) : setUserLoggedIn(false);

    //on load fetch all data based on url
    if (location.pathname === "/products" || location.pathname === "/add-product") dispatch(fetchProducts());
    if (location.pathname === "/customers" || location.pathname === "/add-customer") dispatch(fetchCustomers());
    if (location.pathname === "/vendors" || location.pathname === "/add-vendor") dispatch(fetchVendors());
    if (location.pathname === "/stock-ins"){}
    if (location.pathname === "/add-stock-in" || location.pathname.includes("/stock-in/edit/")) {
      dispatch(fetchProducts());
      dispatch(fetchVendors());
      dispatch(fetchStockIns({pageNo: 1, limit: 10}));
    }
  }, [location, dispatch]);

  let isLoading = productsLoading || customersLoading || vendorsLoading || stockInsLoading;
  
  return (
    <> 
      <Routes>

        {!userLoggedIn && <Route path="/" element={<LandingPage />} />}

        {!userLoggedIn && <Route path="*" element={<Navigate to="/" />} />}

        {!userLoggedIn && <Route path="/auth" element={<AuthForm />} />}

        {!userLoggedIn && <Route path='/password-reset' element={<PasswordResetFlow onBackToLogin={() => {
          navigate("/auth");
        }} />} />}

        {userLoggedIn && <Route path="*" element={<Navigate to="/dashboard" />} />}

        {/* Protected Routes inside Layout */}
        {userLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/edit-product/:id" element={<UpdateProduct />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/edit-customer/:id" element={<UpdateCustomer />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customer/:id" element={<CustomerDetail />} />
            <Route path="/add-vendor" element={<AddVendor />} />
            <Route path="/edit-vendor/:id" element={<UpdateVendor />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendor/:id" element={<VendorDetail />} />
            <Route path="/add-stock-in" element={<AddStockIn />} />
            <Route path="/stock-ins/:page/:pageLimit" element={<AllStockIns />} />
            <Route path="/stock-in/edit/:id" element={<UpdateStockIn />} />
            <Route path="/stock-outs" element={<EmptyInputGroup />} />
            <Route path="/add-stock-out" element={<AddStockOut />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/password-reset" element={<PasswordResetFlow />} />
          </Route>
        )}

          </Routes> 
    </>
  );
};

export default App;
