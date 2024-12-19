import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, data } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../useful/Loading/loading";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";
import ModalAddProduct from "../products/modalAddProduct";

import {
  updateVendor,
  fetchVendors,
} from "../../redux/slices/vendor/vendorsSlice";
import { addStockIn } from "../../redux/slices/stock/stockInSlice";
import { fetchProducts } from "../../redux/slices/products/productsSlice";

const StockIn = () => {
  const dispatch = useDispatch();
  const { vendors, loading } = useSelector((state) => state.vendors);
  const { products } = useSelector((state) => state.products);

  const navigate = useNavigate();
  const location = useLocation();
  //vendor
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [invNo, setInvNo] = useState("");
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

  //product
  const [productSearchInput, setProductSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductList, setSelectedProductList] = useState([]);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(0);
  const [productQuantities, setProductQuantities] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productPurchaseRate, setProductPurchaseRate] = useState('');

  //vendor----------------->
  useEffect(() => {
    if (location.state && location.state.isFromStockIn) {
      //if come back to this page, it holds the old state for once
      const {
        invNo,
        totalAmount,
        description,
        startDate,
        vendorSelected,
        selectedVendorId,
      } = location.state.stockInState;
      setInvNo(invNo);
      setTotalAmount(totalAmount);
      setDescription(description);
      setStartDate(startDate);
      setselectedVendorId(selectedVendorId);
      if (vendorSelected) {
        setName(vendorSelected.name);
        setPhone(vendorSelected.phone);
        setAddress(vendorSelected.address);
        setGstNo(vendorSelected.gstNo);
        setEmail(vendorSelected.email);
      }
      navigate(location.pathname, { replace: true, state: null }); //clear the location state if refrsh
    }
  }, [location.state]);

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

  //product
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

  const handleProductSelect = (product) => {
    if (!selectedProductList.some((p) => p._id == product._id)) {
      setSelectedProductList([...selectedProductList, product]);
      setProductSearchInput("");
    }
    // console.log(selectedProductList);
  };
  const handleProductQuantity = (id, quantity) => {
    productQuantities[id] = quantity;
    setProductQuantities({ ...productQuantities });
    // console.log(productQuantities);
  };

  const handleDeleteProductFromList = (product) => {
    setSelectedProductList(
      selectedProductList.filter((p) => p._id !== product._id)
    );
    delete productQuantities[product._id];
    setProductQuantities({ ...productQuantities });
    console.log(productQuantities);
  };

  const handleSubmitStockIn = async () => {
    // console.log(vendorSelected);
    // console.log(productQuantities);
    // console.log(invNo, startDate, totalAmount, description);
    let products = [];
    for (const [key, value] of Object.entries(productQuantities)) {
      console.log(key, value);
      products.push({
        product: key,
        quantity: value,
        // productPurchaseRate: productPurchaseRate,
      });
    }
    const stockInData = {
      vendor: vendorSelected._id,
      invNo,
      date: startDate,
      totalAmount,
      description,
      products,
    };
    try {
      await dispatch(addStockIn(stockInData)).unwrap();
      setSuccessMsg("Stock In saved successfully");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      dispatch(fetchProducts());
      setProductQuantities({});
      setSelectedProductList([]);
      setVendorSelected("");
      setselectedVendorId("");
      setInvNo("");
      setTotalAmount("");
      setDescription("");
      setProductPurchaseRate('');
      setStartDate(new Date());
    } catch (error) {
      console.log("Failed to add stock in:", error);
      setErrorMsg(error);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* {alarts} */}
      {successMsg && <SuccessAlert successMsg={successMsg} />}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
      <ModalAddProduct
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />

      {/* stockIn */}
      <div class="flex flex-row h-screen gap-6">
        <div class="basis-2/5 bg-red-50 p-5 border border-red-300 rounded-md overflow-auto max-h-full">
          <form class="max-w-sm mx-auto">
            <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white">
              Add Vendor Details
            </h1>
            <div class="mb-5">
              <label
                for="vendors"
                class="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                Select a vendor
              </label>
              <select
                id="vendors"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            <div class="mb-1">
              <label
                for="base-input"
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Invoice no
              </label>
              <input
                type="text"
                id="base-input"
                onChange={(e) => setInvNo(e.target.value.trim())}
                value={invNo}
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="w-full mb-1 flex gap-2 flex-col md:flex-row">
              <div>
                <label
                  for="date"
                  class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Invoice date
                </label>
                <DatePicker
                  id="date"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="block p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  calendarClassName="rounded-lg shadow-lg bg-white"
                  dayClassName={(date) =>
                    date.getDay() === 6 || date.getDay() === 0
                      ? "text-red-500"
                      : "text-black"
                  }
                />
              </div>
              <div>
                <label
                  for="base-input"
                  class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Amount
                </label>
                <input
                  type="text"
                  id="base-input"
                  onChange={(e) => setTotalAmount(e.target.value)}
                  value={totalAmount}
                  // placeholder="Amount"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div class="mb-1">
              <label
                for="base-input"
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <input
                type="text"
                id="base-input"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                // required
                class="bg-gray-50 border h-14 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* if vendor is selected */}
            {selectedVendorId && (
              <>
                <hr class="h-px my-8 bg-red-400 border-0 dark:bg-gray-700"></hr>
                <div class="flex justify-between">
                  <h1 class="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-1xl lg:text-2xl dark:text-white">
                    Selected Vendor Details
                  </h1>

                  <div>
                    <button
                      type="button"
                      onClick={handleEditSelectedVendor}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div class="mb-5">
                  <label
                    for="base-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="base-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone no
                  </label>
                  <input
                    type="number"
                    id="base-input"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone || ""}
                    disabled={isVendorFormFieldsDisabled}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="base-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="base-input"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email || ""}
                    disabled={isVendorFormFieldsDisabled}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="large-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div class="mb-5">
                  <label
                    for="base-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    GST No
                  </label>
                  <input
                    type="string"
                    id="base-input"
                    onChange={(e) => setGstNo(e.target.value)}
                    value={gstNo || ""}
                    disabled={isVendorFormFieldsDisabled}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                {/* if user selects to edit and confirm this section shows */}
                {isUserWantSubmit && (
                  <div class="flex justify-end">
                    <button
                      type="button"
                      onClick={handleVendorUpdateSubmit}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </>
            )}

            <hr class="h-px my-8 bg-red-400 border-0 dark:bg-gray-700"></hr>

            <div class="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  // setIsFromStockIn_forHistory(true);
                  navigate("/add-vendor", {
                    state: {
                      isFromStockIn: true, // true when btn clicked
                      stockInState: {
                        invNo,
                        totalAmount,
                        description,
                        startDate,
                        vendorSelected,
                        selectedVendorId,
                      },
                    },
                  });
                }}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Vendor not found? Create one
              </button>
            </div>
          </form>
        </div>

        <div class="basis-3/5 bg-green-50 p-5 border border-green-300 rounded-md">
          <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white">
            Add Products
          </h1>
          {/* search and search result dropdown component */}
          <div className="flex flex-row justify-between gap-3">
            <div class="mb-5 relative w-4/5">
              <label
                for="products"
                class="block mb-2 text-base font-bold text-gray-900 dark:text-white"
              >
                Select products
              </label>
              <input
                type="text"
                placeholder="Search products name"
                value={productSearchInput}
                onChange={handleProductSearch}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-base font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {filteredProducts.length > 0 &&
                productSearchInput.trim().length > 0 && (
                  <div class="absolute z-10 mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg shadow-md w-full mt-1 max-h-60 overflow-y-auto focus:ring-blue-500 focus:border-blue-500 block p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <table class="w-full">
                      <thead class="text-base text-gray-1000 uppercase underline bg-blue-300 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" class="px-8 py-2 text-left">
                            Product name
                          </th>
                          <th scope="col" class="px-4 py-2 text-right">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr
                            key={product._id}
                            class=" cursor-pointer bg-gray-50 border-b dark:bg-gray-800 text-base dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={() => handleProductSelect(product)}
                          >
                            <th
                              scope="row"
                              class="px-4 py-2 text-left font-medium text-wrap text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {filteredProducts.indexOf(product) + 1}
                              {". "}
                              {product.name}
                            </th>
                            <td class="px-4 py-2 text-right">
                              {product.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
            <div class=" my-auto">
              <button
                type="button"
                onClick={() => setIsModalVisible(!isModalVisible)}
                class="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md sm:w-auto mt-4 py-3 px-6  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add new
              </button>
            </div>
          </div>

          {/* selected product list */}
          <div class="mb-5 w-full border rounded-lg flex flex-col h-3/5 justify-between overflow-y-auto dark:border-gray-600">
            {/* <h1>hi</h1> */}

            <table class="w-full text-sm text-left overflow-y-auto rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-green-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3 w-2/5 border-r border-green-300 dark:border-gray-700"
                  >
                    Product name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 w-1/5 border-r border-green-300 dark:border-gray-700"
                  >
                    Purchase Rate
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 w-1/5 border-r border-green-300 dark:border-gray-700"
                  >
                    Quantity
                  </th>
                  <th scope="col" class="px-3 py-3 w-1/5">
                    Action
                  </th>
                </tr>
              </thead>
              {selectedProductList.length > 0 && (
                <tbody class=" border border-red-800">
                  {selectedProductList.map((product) => (
                    // <>
                    <tr
                      key={product._id}
                      class="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        class=" text-wrap px-3 py-0 font-medium text-gray-900 whitespace-nowrap dark:text-white w-2/5 border-r border-green-200 dark:border-gray-700"
                      >
                        {selectedProductList.indexOf(product) + 1}
                        {". "} {product.name}
                      </th>
                      <td class="px-6 py-0 w-1/5 border-r border-green-200 dark:border-gray-700">
                        <input
                          type="text"
                          placeholder="rate"
                          value={productPurchaseRate || ''}
                          onChange={(e) =>
                            setProductPurchaseRate(e.target.value)
                          }
                          class="bg-gray-50 max-h-9 mt-1 border border-gray-300 text-gray-900 text-base font-normal rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </td>
                      <td class="px-6 py-0 w-1/5 border-r border-green-200 dark:border-gray-700">
                        <input
                          type="text"
                          placeholder="Quantity"
                          value={productQuantities[product._id] || ""}
                          onChange={(e) =>
                            handleProductQuantity(product._id, e.target.value)
                          }
                          class="bg-gray-50 max-h-9 mt-1 border border-gray-300 text-gray-900 text-base font-normal rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <h1 class="text-black-400 mt-1 font-normal">
                          Present stock:{" "}
                          {product.quantity + parseInt("0")}
                        </h1>
                      </td>
                      <td class="px-3 py-0 w-1/5 ">
                        <button
                          type="button"
                          onClick={() => handleDeleteProductFromList(product)}
                          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                    // </>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              onClick={() => handleSubmitStockIn()}
              class="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockIn;
