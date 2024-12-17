import react, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import VendorListTable from '../useful/vendors/vendorListTable';
import SuccessAlert from '../useful/alerts/successAlert';
import ErrorAlert from '../useful/alerts/errorAlert';
import Loading from '../useful/Loading/loading';

const VendorList = () => {
    const { vendors, loading } = useSelector((state) => state.vendors);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    if(loading){return <Loading />;}

    return (
        <>
            {/** Product List **/}
            <VendorListTable setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg} />
            {/** success message **/}
            {successMsg && <SuccessAlert successMsg={successMsg} />}
            {/** Error message **/}
            {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
        </>
    )
};

export default VendorList;