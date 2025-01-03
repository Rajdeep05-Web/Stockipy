// import { Routes, Route, BrowserRouter } from "react-router";
// import "./App.css";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// //comps
// import Loading from "./components/useful/Loading/loading";
// import App1 from "./components/App1";
// import AddProduct from "./components/products/addProduct";
// import ProductList from "./components/products/productList";
// import UpdateProduct from "./components/products/updateProduct";
// import AddCustomer from "./components/customer/addCustomer";
// import UpdateCustomer from "./components/customer/updateCustomer";
// import CustomerList from "./components/customer/customerList";
// import AddVendor from "./components/vendor/addvendor";
// import VendorList from "./components/vendor/vendorList";
// import UpdateVendor from "./components/vendor/updateVendor";
// import StockIn from "./components/stock/stockIn";
// import ModalAddProduct from "./components/products/modalAddProduct";
// // import DrawerNav from "./components/useful/drawerNav";
// import NavbarSidebar from "./components/useful/navSideBar";

// //actions
// import { fetchProducts } from "./redux/slices/products/productsSlice";
// import { fetchCustomers } from "./redux/slices/customers/customersSlice";
// import { fetchVendors } from "./redux/slices/vendor/vendorsSlice";


// const App = () => {
//   const dispatch = useDispatch();
//   const { loading: productsLoading } = useSelector((state) => state.products);
//   const { loading: customersLoading } = useSelector((state) => state.customers);

//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(fetchCustomers());
//     dispatch(fetchVendors());
// }, [dispatch]); 

// // if (productsLoading || customersLoading) return <Loading />; // Using this leading leading to not showing success and error alerts
// //each child component will have its own loading component

//   return (
//     <BrowserRouter> 
    
//     <div className="App">

//       <Routes>
//         <Route path="/" element={<App1 />} />

//         <Route path="/add-product" element={<AddProduct />} />
//         <Route path="/products" element={<ProductList />} />
//         <Route path="/edit-product/:id" element={<UpdateProduct />} />

//         <Route path="/add-customer" element={<AddCustomer />} />
//         <Route path="/edit-customer/:id" element={<UpdateCustomer />} />
//         <Route path="/customers" element={<CustomerList />} />

//         <Route path="/add-vendor" element={<AddVendor />} />
//         <Route path='/edit-vendor/:id' element={<UpdateVendor />} />
//         <Route path="/vendors" element={<VendorList />} />

//         <Route path="/stock-in" element={<StockIn />} />
//         <Route path="/test" element={<NavbarSidebar />} />
//       </Routes>

//     </div>
//     </BrowserRouter>   
//   )
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

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
import StockIn from "./components/stock/stockIn";
import Accordion from "./components/useful/stockIn/accordion";
// import TooltipButton from "./components/useful/stockIn/tooltip";

// Redux Actions
import { fetchProducts } from "./redux/slices/products/productsSlice";
import { fetchCustomers } from "./redux/slices/customers/customersSlice";
import { fetchVendors } from "./redux/slices/vendor/vendorsSlice";
import { fetchStockIns } from "./redux/slices/stock/stockInSlice";

const App = () => {
  const dispatch = useDispatch();
  const { loading: productsLoading } = useSelector((state) => state.products);
  const { loading: customersLoading } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
    dispatch(fetchVendors());
    dispatch(fetchStockIns())
  }, [dispatch]);

  // if (productsLoading || customersLoading) return <Loading />;

  return (
    <BrowserRouter>
      <NavbarSidebar>
        <Routes>
          <Route path="/" element={<App1 />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/edit-product/:id" element={<UpdateProduct />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/edit-customer/:id" element={<UpdateCustomer />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/add-vendor" element={<AddVendor />} />
          <Route path="/edit-vendor/:id" element={<UpdateVendor />} />
          <Route path="/vendors" element={<VendorList />} />
          <Route path="/add-stock-in" element={<StockIn />} />
          {/* <Route path="/test" element={<TooltipButton />} /> */}
          <Route path="/stock-ins" element ={<Accordion />} />
        </Routes>
      </NavbarSidebar>
    </BrowserRouter>
  );
};

export default App;
