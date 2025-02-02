import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { PDFViewer } from "@react-pdf/renderer";

// Components
import NavbarSidebar from "./components/useful/navbarSidebar";
import Loading from "./components/useful/Loading/loading";
import App1 from "./components/App1";
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
import TestPdf from "./components/useful/pdf/testpdf";
import { FilePicker } from "./components/useful/filepicker/filePicker";
// import TooltipButton from "./components/useful/stockIn/tooltip";

// Redux Actions
import { fetchProducts } from "./redux/slices/products/productsSlice";
import { fetchCustomers } from "./redux/slices/customers/customersSlice";
import { fetchVendors } from "./redux/slices/vendor/vendorsSlice";
import { fetchStockIns } from "./redux/slices/stock/stockInSlice";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading: productsLoading } = useSelector((state) => state.products);
  const { loading: customersLoading } = useSelector((state) => state.customers);
  const { loading: vendorsLoading } = useSelector((state) => state.vendors);
  const { loading: stockInsLoading } = useSelector((state) => state.stockIns);

  useEffect(() => {
    if (location.pathname === "/products") dispatch(fetchProducts());
    if (location.pathname === "/customers") dispatch(fetchCustomers());
    if (location.pathname === "/vendors") dispatch(fetchVendors());
    if (location.pathname === "/stock-ins") dispatch(fetchStockIns());
    if (location.pathname === "/add-stock-in" || location.pathname.includes("/stock-in/edit/")) {
      dispatch(fetchProducts());
      dispatch(fetchVendors());
      dispatch(fetchStockIns());
    }
  }, [location, dispatch]);

  let isLoading =
    productsLoading || customersLoading || vendorsLoading || stockInsLoading;

  return (
    <>
      {/* {isLoading ? (
        <Loading />
      ) : ( */}
        <NavbarSidebar>
          <Routes>
            <Route path="/" element={<App1 />} />
            <Route path="dashboard" element={<App1 />} />
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
            <Route path="stock-in/edit/:id" element={<UpdateStockIn />} />
            <Route path="/test" element={<FilePicker />} />
          </Routes>
        </NavbarSidebar>
      {/* )} */}
    </>
  );
};

export default App;
