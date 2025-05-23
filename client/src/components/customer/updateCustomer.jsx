import react , {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useLocation, useParams, useNavigate} from 'react-router'
 
import { updateCustomer, fetchCustomers } from '../../redux/slices/customers/customersSlice';

import Loading from '../useful/Loading/loading';

import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";

const UpdateCustomer = () => {

const dispatch = useDispatch();
const location = useLocation();
const {loading} = useSelector((state)=>state.customers);
const navigate = useNavigate();

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [gstNo, setGstNo] = useState("");
const [email, setEmail] = useState("");
const [successMsg, setSuccessMsg] = useState("");
const [errorMsg, setErrorMsg] = useState("");


const {id} = useParams();
const customerToUpdate = location.state.customer;

useEffect(()=>{
    if(customerToUpdate){
        setName(customerToUpdate.name);
        setEmail(customerToUpdate.email);
        setPhone(customerToUpdate.phone);
        setAddress(customerToUpdate.address);
        setGstNo(customerToUpdate.gstNo);
    }
},[customerToUpdate]);

// const nullifyFields = () => {
//     setAddress("");
//     setEmail("");
//     setName("");
//     setPhone("");
//     setGstNo("");
// }

if(loading) return <Loading />;

const handleSubmit = async (e) =>{
    e.preventDefault();
    const updatedCustomer = {name, phone, address, gstNo, email};
    try {
        await dispatch(updateCustomer({id, customer: updatedCustomer})).unwrap();
        setSuccessMsg('Customer updated successfully');
        // nullifyFields();
        dispatch(fetchCustomers());
        setTimeout(() => {
            setSuccessMsg("");
            navigate(-1);
        }, 3000);
    } catch (error) {
        console.error('Failed to update customer:', error);
        setErrorMsg(error);
        setTimeout(() => {
            setErrorMsg("");
        }, 3000);
    }
};

    return (<>
     <form class="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Update Customer Details
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
            value={name} required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone No
          </label>
          <input
            type="text"
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
            type="text"
            id="base-input"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="mb-5">
          <label
            for="base-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Address
          </label>
          <input
            type="text"
            id="base-input"
            onChange={(e) => setAddress(e.target.value)}
            value={address} required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            type="text"
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
          Update Customer
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          class="text-gray-900 mx-2 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Cancel
        </button>
      </form>
      {successMsg && <SuccessAlert successMsg={successMsg} />}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
    </>)
};

export default UpdateCustomer;