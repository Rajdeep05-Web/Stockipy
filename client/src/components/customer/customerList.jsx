import react, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CustomerListTable from '../useful/customers/customerListTable';
import SuccessAlert from '../useful/alerts/successAlert';
import ErrorAlert from '../useful/alerts/errorAlert';
import Loading from '../useful/Loading/loading';


const CustomerList = () => {
    const { customers, loading } = useSelector((state) => state.customers);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    if(loading){return <Loading />;}
    return (
        <>
            {/** Product List **/}
            <CustomerListTable customers={customers} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg} />

            {/** success message **/}
            {successMsg && <SuccessAlert successMsg={successMsg} />}
            {/** Error message **/}
            {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
        </>
    )
};

export default CustomerList;