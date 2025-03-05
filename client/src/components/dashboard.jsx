import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Dashboard() {
  const { products, loading } = useSelector((state) => state.products);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-3xl font-black underline">Wecome</h1>
    </>
  );
}

export default Dashboard;
