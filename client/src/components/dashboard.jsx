import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Inventory from "../components/dashboard/inventoryOverview";
import StockMovements from "../components/dashboard/stockMovements";

function Dashboard() {
  const { products, loading } = useSelector((state) => state.products);
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <div>

    <Inventory />
    <StockMovements />
    </div>
    </>
  );
}

export default Dashboard;
