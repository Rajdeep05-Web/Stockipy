import react, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//comps
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";
import CustomerListTable from "../useful/customers/customerListTable";
import Loading from "../useful/Loading/loading";

//redux
import { addCustomer, fetchCustomers } from "../../redux/slices/customers/customersSlice";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customers);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState("");

   useEffect(() => {
      if (localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'));
      } else {
        history.push('/login');
      }
    }, [setToken, history]);

  const nullifyFields = () => {
    setAddress("");
    setEmail("");
    setName("");
    setPhone("");
    setGstNo("");
  };
  if (loading) return <Loading />;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCustomer = { name, phone, address, gstNo, email };
    try {
      await dispatch(addCustomer({ newCustomer, token })).unwrap();
      nullifyFields();
      setSuccessMsg('Customer added successfully');
      setTimeout(() => { setSuccessMsg("") }, 3000);
    } catch (error) {
      console.log('Failed to add customer:', error);
      setErrorMsg(error);
      setTimeout(() => { setErrorMsg("") }, 3000);
    } finally {
      dispatch(fetchCustomers());// 1st fetch is done in App.jsx    2nd fetch is done here after adding a new customer
    }
  };


  return <>
    <form
      class="max-w-sm mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Add Customer
      </h1>
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
          value={name}
          required
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
          value={phone}
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
          value={email}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div class="mb-5">
        <label for="large-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Address
        </label>
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          value={address} required
          id="large-input" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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
          value={gstNo}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>

    {/** Product List **/}
    <hr className="my-5 bg-gray-600 border-1 dark:bg-gray-700" />
    <div class="container mt-5 sm:mt-0">
    <CustomerListTable customers={customers} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg} />
    </div>
    
    {/** success message **/}
    {successMsg && <SuccessAlert successMsg={successMsg} />}
    {/** Error message **/}
    {errorMsg && <ErrorAlert errorMsg={errorMsg} />}

  </>;
};

export default AddCustomer;
