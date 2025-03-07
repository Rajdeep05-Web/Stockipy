import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

// Components
import NavbarSidebar from "./components/useful/navbarSidebar";
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
import Layout from "./components/useful/layout";

// Redux Actions
import { fetchProducts } from "./redux/slices/products/productsSlice";
import { fetchCustomers } from "./redux/slices/customers/customersSlice";
import { fetchVendors } from "./redux/slices/vendor/vendorsSlice";
import { fetchStockIns } from "./redux/slices/stock/stockInSlice";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [userLoggedIn, setUserLoggedIn] = useState(!!localStorage.getItem("token"));
  const { loading: productsLoading } = useSelector((state) => state.products);
  const { loading: customersLoading } = useSelector((state) => state.customers);
  const { loading: vendorsLoading } = useSelector((state) => state.vendors);
  const { loading: stockInsLoading } = useSelector((state) => state.stockIns);

  useEffect(() => {
    (localStorage.getItem("token")) ? setUserLoggedIn(true) : setUserLoggedIn(false);
    if (location.pathname === "/products" || location.pathname === "/add-product") dispatch(fetchProducts());
    if (location.pathname === "/customers" || location.pathname === "/add-customer") dispatch(fetchCustomers());
    if (location.pathname === "/vendors" || location.pathname === "/add-vendor") dispatch(fetchVendors());
    if (location.pathname === "/stock-ins") dispatch(fetchStockIns());
    if (location.pathname === "/add-stock-in" || location.pathname.includes("/stock-in/edit/")) {
      dispatch(fetchProducts());
      dispatch(fetchVendors());
      dispatch(fetchStockIns());
    }
  }, [location, dispatch]);

  let isLoading = productsLoading || customersLoading || vendorsLoading || stockInsLoading;
  
  return (
    <> 
      <Routes>

        {!userLoggedIn && <Route path="/auth" element={<AuthForm />} />}

        {!userLoggedIn && <Route path="*" element={<Navigate to="/auth" />} />}
      
        {userLoggedIn && <Route path="*" element={<Navigate to="/dashboard" />} />}

        {/* Protected Routes inside Layout */}
        {userLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/edit-product/:id" element={<UpdateProduct />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/edit-customer/:id" element={<UpdateCustomer />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/add-vendor" element={<AddVendor />} />
            <Route path="/edit-vendor/:id" element={<UpdateVendor />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/add-stock-in" element={<AddStockIn />} />
            <Route path="/stock-ins" element={<AllStockIns />} />
            <Route path="/stock-in/edit/:id" element={<UpdateStockIn />} />
          </Route>
        )}

          </Routes> 
    </>
  );
};

export default App;
