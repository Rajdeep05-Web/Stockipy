import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router";

import {
  fetchProducts,
  deleteProduct
} from "../../redux/slices/products/productsSlice";

//comps
import Loading from "../useful/Loading/loading";
import SuccessAlert from "../useful/alerts/successAlert";
import ErrorAlert from "../useful/alerts/errorAlert";
import ProductListTable from "../useful/products/productListTable";

const ProductList = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);


  if (status === "loading") return <Loading />;
  if (status === "failed") {
    return <ErrorAlert errorMsg={`Error fetching data: ${error}`} />;
  }

  return (
    <>
    <ProductListTable products={products} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>
      {/** success message **/}
      {successMsg && <SuccessAlert successMsg={successMsg} />}
      {/** Error message **/}
      {errorMsg && <ErrorAlert errorMsg={errorMsg} />}
    </>
  );
};

export default ProductList;
