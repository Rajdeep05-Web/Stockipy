import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, data } from "react-router";
import DatePicker from "react-datepicker";
import { Trash2, Plus } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";


import Loading from "../useful/Loading/loading";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";
import ModalAddProduct from "../products/modalAddProduct";
import ModalAddVendor from "../vendor/modalAddVendor";
import { FilePicker } from "../useful/filepicker/filePicker";


import {
 updateVendor,
 fetchVendors,
} from "../../redux/slices/vendor/vendorsSlice";
import {
 addStockIn,
 fetchStockIns,
} from "../../redux/slices/stock/stockInSlice";
import { fetchProducts } from "../../redux/slices/products/productsSlice";


const AddStockIn = () => {
 const dispatch = useDispatch();
 function nextInvNoGen(){};
 const { vendors, loading: vendorsLoading } = useSelector((state) => state.vendors);
 const { products, loading: productsLoading } = useSelector((state) => state.products);
 const { stockIns, loading: stockInsLoading } = useSelector((state) => state.stockIns);


 //vendor
 const [successMsg, setSuccessMsg] = useState("");
 const [errorMsg, setErrorMsg] = useState("");
 const [startDate, setStartDate] = useState(new Date());
 const [invNo, setInvNo] = useState(stockIns ? nextInvNoGen(stockIns[stockIns?.length-1]?.invoiceNo) : "");
 const [totalAmount, setTotalAmount] = useState("");
 const [description, setDescription] = useState("");
 const [name, setName] = useState("");
 const [phone, setPhone] = useState("");
 const [address, setAddress] = useState("");
 const [gstNo, setGstNo] = useState("");
 const [email, setEmail] = useState("");
 const [selectedVendorId, setselectedVendorId] = useState("");
 const [vendorSelected, setVendorSelected] = useState("");
 const [isVendorFormFieldsDisabled, setisVendorFormFieldsDisabled] =
   useState(true);
 const [isUserWantSubmit, setIsUserWantSubmit] = useState(false);
 const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
 const [file, setFile] = useState(null);


 //product
 const [productSearchInput, setProductSearchInput] = useState("");
 const [filteredProducts, setFilteredProducts] = useState([]);
 const [selectedProductList, setSelectedProductList] = useState([]);
 const [productQuantities, setProductQuantities] = useState({});
 const [allProductRates, setAllProductRates] = useState({});
 const [allProductMRPs, setAllProductMRPs] =  useState({});
 const [isProductModalVisible, setIsProductModalVisible] = useState(false);




 //vendor----------------->


 //showing selected vendor data in form
 const handleVendorChange = (e) => {
   // e.preventDefault();
   // console.log(selectedVendorId);
   setselectedVendorId(e.target.value);
   if (e.target.value) {
     const vendor = vendors.find((vendor) => vendor._id === e.target.value);
     if (vendor) {
       setName(vendor.name);
       setPhone(vendor.phone);
       setAddress(vendor.address);
       setGstNo(vendor.gstNo);
       setEmail(vendor.email);
       setVendorSelected(vendor);
     }
   }
 };


 //vendor edit functions
 const handleEditSelectedVendor = () => {
   const userResponse = window.confirm("Do you want to edit vendor?");
   if (userResponse) {
     alert("Now you can edit vendor details");
     setisVendorFormFieldsDisabled(false);
     setIsUserWantSubmit(true);
   }
 };
 const handleVendorUpdateSubmit = () => {
   const newVendor = { name, phone, address, gstNo, email };
   try {
     dispatch(
       updateVendor({ id: selectedVendorId, vendor: newVendor })
     ).unwrap();
     setSuccessMsg("Vendor Updated successfully");
     setTimeout(() => {
       setSuccessMsg("");
     }, 3000);
     setisVendorFormFieldsDisabled(true);
     setIsUserWantSubmit(false);
     dispatch(fetchVendors());
   } catch (error) {
     console.log("Failed to update vendor:", error);
     setErrorMsg(error);
     setTimeout(() => {
       setErrorMsg("");
     }, 3000);
   }
 };


function nextInvNoGen(oldInv) {
 if (!oldInv) return null;
  const oldInvSplit = oldInv.split("/");
 const lastPart = oldInvSplit[oldInvSplit.length - 1];
  // Extract leading zeros info
 const numberLength = lastPart.length;
 const number = parseInt(lastPart, 10);
  if (isNaN(number)) return null;
  const incremented = (number + 1).toString().padStart(numberLength, '0');
  oldInvSplit[oldInvSplit.length - 1] = incremented;
 console.log(oldInvSplit);
 return oldInvSplit.join("/");
};


 //product


 //total amount calculation
 useEffect(() => {
   calculateAmountTotal();
 },[selectedProductList, allProductRates, allProductMRPs, productQuantities]);
  const calculateAmountTotal = () => {
   let total = 0;
   for(const [key, value] of Object.entries(productQuantities)){
     const rate = allProductRates[key] || 0;
     total = total + (rate*value);
   }
   setTotalAmount(total);
 }


 //product search in the search bar
 const handleProductSearch = (e) => {
   setProductSearchInput(e.target.value);
   const searchTerm = e.target.value;
   const filteredProducts = products.filter(
     (p) =>
       p.name
         .toLowerCase()
         .replace(/\s+/g, "")
         .includes(searchTerm.toLowerCase().trim().replace(/\s+/g, "")) //check both after to lowercase and no white spaces
   );
   setFilteredProducts(filteredProducts);
   // if(filteredProducts.length > 0){
   //   console.log("product match", filteredProducts.length)


   // }
 };
  //product selected from search bar
 const handleProductSelect = (product) => {
   if (!selectedProductList.some((p) => p._id == product._id)) {
     setSelectedProductList([...selectedProductList, product]);
     setProductSearchInput("");
   }
 };


 //product quantity with id in state handled
 const handleProductQuantity = (id, quantity) => {
   setProductQuantities({ ...productQuantities, [id]: quantity });
   calculateAmountTotal();
 };


 //all products MRP with id in state handled
 const handleProductMRP = (id, mrp) => {
   setAllProductMRPs({...allProductMRPs, [id]: mrp});
 }


 //all products purchase rate with id in state hndled
 const handleProductPurcahseRate = (id, rate) => {
    setAllProductRates({...allProductRates, [id]: rate});
 }
    //product deleted from selected list
 const handleDeleteProductFromList = (product) => {
   setSelectedProductList(
     selectedProductList.filter((p) => p._id !== product._id)
   );
   delete productQuantities[product._id];
   delete allProductRates[product._id];
   delete allProductMRPs[product._id]
   setProductQuantities({ ...productQuantities });
   setAllProductRates({...allProductRates});
   setAllProductMRPs({...allProductMRPs});
   // console.log(productQuantities);
 };
  //final submit of stock in
 const handleSubmitStockIn = async () => {


   let stockInProducts = [];
   const stockInFormdata = new FormData();


   for (const [key, value] of Object.entries(productQuantities)) {
     stockInProducts.push({
       product: key,
       quantity: value,
       productPurchaseRate: parseInt(allProductRates[key]),
       mrp: parseInt(allProductMRPs[key]),
     });
   }


   const stockInData = {
     vendor: vendorSelected._id,
     invNo,
     date: startDate,
     totalAmount,
     description,
     products : stockInProducts,
   };


   try {
     await dispatch(addStockIn({stockInData, file})).unwrap();
     setSuccessMsg("Stock In saved successfully");
     setTimeout(() => {
       setSuccessMsg("");
     }, 3000);
     dispatch(fetchProducts());
     dispatch(fetchVendors());
     dispatch(fetchStockIns());
     setProductQuantities({});
     setSelectedProductList([]);
     setFile(null); //reset file state
     setVendorSelected("");
     setselectedVendorId("");
     setInvNo("");
     setTotalAmount("");
     setDescription("");
     setStartDate(new Date());
   } catch (error) {
     console.log("Failed to add stock in:", error);
     setErrorMsg(error);
     setTimeout(() => {
       setErrorMsg("");
     }, 3000);
   }
 };


 if (vendorsLoading || productsLoading || stockInsLoading) {
   return <Loading />;
 }


 return (
   <>
     {/* {alarts} */}
     {successMsg && <SuccessAlert successMsg={successMsg} />}
     {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
     <ModalAddProduct
       isModalVisible={isProductModalVisible}
       setIsModalVisible={setIsProductModalVisible}
     />
     <ModalAddVendor
       isModalVisible={isVendorModalVisible}
       setIsModalVisible={setIsVendorModalVisible}
     />


     {/* stockIn */}
     <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden p-4 gap-4">
      {/* <div className="flex flex-1 flex-col md:flex-row gap-4 overflow-hidden min-h-0 w-full p-4"> */}


       {/* vendor */}
      <div className="basis-full md:basis-2/5 min-w-[320px] max-h-[690px] overflow-auto border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:border-gray-700 p-4">
         <form className=" max-w-full lg:max-w-sm mx-auto">
           <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white">
             Add Vendor Details
           </h1>
           <div className="mb-5">
             <label
               htmlFor="vendors"
               className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
             >
               Select a vendor
             </label>
             <select
               id="vendors"
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               value={selectedVendorId}
               onChange={handleVendorChange}
               required
             >
               <option value="">Choose a vendor</option>
               {vendors.map((vendor) => (
                 <option key={vendor._id} value={vendor._id}>
                   {vendor.name}
                 </option>
               ))}
             </select>
           </div>
           <div className="mb-1">
             <label
               htmlFor="base-input"
               className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
             >
               Invoice no
             </label>
             <input
               type="text"
               id="base-input"
               onChange={(e) => setInvNo(e.target.value.trim())}
               value={invNo}
               required
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             />
           </div>
           <div className="w-full mb-1 flex gap-2 flex-col md:flex-row">
             <div>
               <label
                 htmlFor="date"
                 className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
               >
                 Invoice date
               </label>
               <DatePicker
                 id="date"
                 selected={startDate}
                 onChange={(date) => setStartDate(date)}
                 className="block p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                 calendarClassName="rounded-lg shadow-lg bg-white dark:bg-gray-800"
                 dayClassName={(date) =>
                   date.getDay() === 6 || date.getDay() === 0
                     ? "text-red-500"
                     : "text-black dark:text-white"
                 }
               />
             </div>
             <div>
               <label
                 htmlFor="base-input"
                 className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
               >
                 Amount
               </label>
               <input
                 type="text"
                 id="base-input"
                 onChange={(e) => setTotalAmount(e.target.value)}
                 value={totalAmount || ""}
                 // placeholder="Amount"
                 required
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               />
             </div>
           </div>
           <div className="mb-1">
             <label
               htmlFor="base-input"
               className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
             >
               Description
             </label>
             <input
               type="text"
               id="base-input"
               onChange={(e) => setDescription(e.target.value)}
               value={description}
               // required
               className="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             />
           </div>


           {/* if vendor is selected */}
           {selectedVendorId && (
             <>
               <hr className="h-px my-8 bg-red-400 border-0 dark:bg-gray-700"></hr>
               <div className="flex justify-between">
                 <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-1xl lg:text-2xl dark:text-white">
                   Selected Vendor Details
                 </h1>


                  { !isUserWantSubmit && (
                 <div>
                   <button
                     type="button"
                     onClick={handleEditSelectedVendor}
                     className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                   >
                     Edit
                   </button>
                 </div>
                   )}
               </div>
               <div className="mb-5">
                 <label
                   htmlFor="base-input"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                 >
                   Name
                 </label>
                 <input
                   type="text"
                   id="base-input"
                   onChange={(e) => setName(e.target.value)}
                   value={name || ""}
                   required
                   disabled={isVendorFormFieldsDisabled}
                   className={`${isUserWantSubmit?"bg-gray-50":"bg-gray-100"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                 />
               </div>
               <div className="mb-5">
                 <label
                   htmlFor="base-input"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                 >
                   Phone no
                 </label>
                 <input
                   type="number"
                   id="base-input"
                   onChange={(e) => setPhone(e.target.value)}
                   value={phone || ""}
                   disabled={isVendorFormFieldsDisabled}
                   className={`${isUserWantSubmit?"bg-gray-50":"bg-gray-100"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                 />
               </div>
               <div className="mb-5">
                 <label
                   htmlFor="base-input"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                 >
                   Email
                 </label>
                 <input
                   type="email"
                   id="base-input"
                   onChange={(e) => setEmail(e.target.value)}
                   value={email || ""}
                   disabled={isVendorFormFieldsDisabled}
                   className={`${isUserWantSubmit?"bg-gray-50":"bg-gray-100"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                 />
               </div>
               <div className="mb-5">
                 <label
                   htmlFor="large-input"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                 >
                   Address
                 </label>
                 <input
                   type="text"
                   onChange={(e) => setAddress(e.target.value)}
                   value={address || ""}
                   required
                   disabled={isVendorFormFieldsDisabled}
                   id="large-input"
                   className={`block w-full p-4 text-gray-900 border border-gray-300 rounded-lg ${isUserWantSubmit?"bg-gray-50":"bg-gray-100"} text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                 />
               </div>
               <div className="mb-5">
                 <label
                   htmlFor="base-input"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                 >
                   GST No
                 </label>
                 <input
                   type="string"
                   id="base-input"
                   onChange={(e) => setGstNo(e.target.value)}
                   value={gstNo || ""}
                   disabled={isVendorFormFieldsDisabled}
                   className={`${isUserWantSubmit?"bg-gray-50":"bg-gray-100"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                 />
               </div>
               {/* if user selects to edit and confirm this section shows */}
               {isUserWantSubmit && (
                 <div className="flex justify-end">
                   <button
                     type="button"
                     onClick={handleVendorUpdateSubmit}
                     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                   >
                     Submit
                   </button>
                 </div>
               )}
             </>
           )}


           <hr className="h-px my-8 bg-red-400 border-0 dark:bg-gray-700"></hr>


           <div className="flex justify-end">
             <button
               type="button"
               onClick={() => setIsVendorModalVisible(!isVendorModalVisible)}
               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
             >
               Vendor not found? Create one
             </button>
           </div>
           <label
               htmlFor="file"
               className="block mt-6 mb-2 text-base font-bold text-gray-900 dark:text-white"
             >
               Upload invoice
             </label>
           <div className="flex flex-col justify-end" name="file">
             <FilePicker setFile={setFile} />
           </div>
         </form>
       </div>
      
       {/* product */}
       <div className="basis-full md:basis-3/5 min-w-[320px] h-full overflow-y-auto border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:border-gray-700 p-4">
         <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white">
           Add Products
         </h1>
         {/* search and search result dropdown component */}
         <div className="flex flex-row justify-between">
           <div className="mb-5 relative w-4/6 sm:w-3/4">
             <label
               htmlFor="products"
               className="block mb-2 text-base font-bold text-gray-900 dark:text-white"
             >
               Select products
             </label>
             <input
               type="text"
               placeholder="Search products name"
               value={productSearchInput}
               onChange={handleProductSearch}
               className="bg-gray-50 border border-gray-300 text-gray-900 text-base font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
             />
             {filteredProducts.length > 0 &&
               productSearchInput.trim().length > 0 && (
                 <div className="absolute z-10 mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-md w-full mt-1 max-h-60 overflow-y-auto focus:ring-blue-500 focus:border-blue-500 block p-0.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                   <table className="w-full">
                     <thead className="text-base text-gray-1000 uppercase underline bg-blue-300 dark:bg-gray-700 dark:text-gray-400">
                       <tr>
                         <th scope="col" className="px-8 py-2 text-left">
                           Product name
                         </th>
                         <th scope="col" className="px-4 py-2 text-right">
                           Quantity
                         </th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredProducts.map((product) => (
                         <tr
                           key={product._id}
                           className=" cursor-pointer bg-gray-50 border-b dark:bg-gray-900 text-base dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                           onClick={() => handleProductSelect(product)} title={`${product.name}`}
                         >
                           <th
                             scope="row"
                             className="px-4 py-2 text-left font-medium text-wrap text-gray-900 dark:text-white whitespace-nowrap max-w-6 text-ellipsis overflow-hidden"
                           >
                             {filteredProducts.indexOf(product) + 1}
                             {". "}
                             {product.name}
                           </th>
                           <td className="px-4 py-2 text-right">
                             {product.quantity}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
           </div>
           <div className=" my-auto">
             <button
               type="button"
               onClick={() => setIsProductModalVisible(!isProductModalVisible)}
               className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md w-auto mt-4 py-3 px-3 sm:px-5  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
             >
               {/* Add new */}
               <Plus strokeWidth={3} />


             </button>
           </div>
         </div>


         {/* selected product list */}
         <div className="mb-5 w-full min-h-[440px] max-h-[440px] overflow-x-auto overflow-y-auto border rounded-lg dark:border-gray-600">
 <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
   <thead className="text-sm text-gray-700 uppercase bg-green-100 dark:bg-gray-700 dark:text-gray-400">
     <tr>
       <th className="px-3 py-3 min-w-[240px] border-r border-green-300 dark:border-gray-700">
         Product name
       </th>
       <th className="px-3 py-3 min-w-[120px] border-r border-green-300 dark:border-gray-700">
         Purchase Rate
       </th>
       <th className="px-3 py-3 min-w-[120px] border-r border-green-300 dark:border-gray-700">
         MRP
       </th>
       <th className="px-3 py-3 min-w-[140px] border-r border-green-300 dark:border-gray-700">
         Sale Rate (INC. GST)
       </th>
       <th className="px-6 py-3 min-w-[120px] border-r border-green-300 dark:border-gray-700">
         Quantity
       </th>
       <th className="px-3 py-3 min-w-[100px]">Action</th>
     </tr>
   </thead>


   {selectedProductList.length > 0 && (
     <tbody className="border border-red-800">
       {selectedProductList.map((product) => (
         <tr
           key={product._id}
           className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
         >
           <th
             scope="row"
             className="px-3 py-2 font-medium text-gray-900 dark:text-white text-wrap whitespace-nowrap border-r border-green-200 dark:border-gray-700"
           >
             {selectedProductList.indexOf(product) + 1}
             {". "} {product.name}
           </th>


           <td className="px-3 py-2 border-r border-green-200 dark:border-gray-700">
             <input
               type="text"
               placeholder="Rate"
               required
               value={
                 allProductRates[product._id] !== undefined
                   ? allProductRates[product._id]
                   : product.productPurchaseRate &&
                     handleProductPurcahseRate(
                       product._id,
                       product.productPurchaseRate
                     )
               }
               onChange={(e) =>
                 handleProductPurcahseRate(product._id, e.target.value)
               }
               className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 max-h-9 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
             />
           </td>


           <td className="px-3 py-2 border-r border-green-200 dark:border-gray-700">
             <input
               type="text"
               placeholder="MRP"
               required
               value={
                 allProductMRPs[product._id] !== undefined
                   ? allProductMRPs[product._id]
                   : product.mrp &&
                     handleProductMRP(product._id, product.mrp)
               }
               onChange={(e) =>
                 handleProductMRP(product._id, e.target.value)
               }
               className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 max-h-9 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
             />
           </td>


           <td className="px-3 py-2 border-r border-green-200 dark:border-gray-700">
             <input
               type="text"
               disabled
               placeholder="Rate"
               value={product.rate}
               className="bg-gray-200 border border-gray-300 text-gray-900 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 max-h-9 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
             />
           </td>


           <td className="px-3 py-2 border-r border-green-200 dark:border-gray-700">
             <input
               type="text"
               placeholder="Quantity"
               value={productQuantities[product._id] || ""}
               onChange={(e) =>
                 handleProductQuantity(product._id, e.target.value)
               }
               className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 max-h-9 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
             />
             <h1
               className={`mt-1 font-normal ${
                 product.quantity < 5
                   ? "text-red-500"
                   : "text-green-500"
               } dark:text-gray-300`}
             >
               Stock:{" "}
               <span className="font-semibold">
                 {product.quantity}
               </span>
             </h1>
           </td>


           <td className="px-3 py-2 text-center">
             <button
               type="button"
               onClick={() => handleDeleteProductFromList(product)}
               className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
             >
               <Trash2 />
             </button>
           </td>
         </tr>
       ))}
     </tbody>
   )}
 </table>
</div>


         <div className="flex justify-end">
           <button
             type="button"
             onClick={() => handleSubmitStockIn()}
             className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           >
             Save
           </button>
         </div>
       </div>
     {/* </div> */}
     </div>
   </>
 );
};


export default AddStockIn;



