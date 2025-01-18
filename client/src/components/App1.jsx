import { increment, decrement } from "../redux/slices/counter/counterSlice";
import { useDispatch, useSelector } from "react-redux";

function App1() {
  const {products, loading} = useSelector((state) => state.products);
  const count = useSelector((state) => state.counter);
  const Dispatch = useDispatch();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-3xl font-black underline">Wecome</h1>
      {/* <h1>counter is {count}</h1>
      <button onClick={() => Dispatch(increment())}>Increment</button>
      <button onClick={() => Dispatch(decrement())}>Decrement</button>
      <div>
            <h1>Product List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        {product.name} - Quantity: {product.quantity} - RS: {product.rate} - MRP: {product.mrp}
                    </li>
                ))}
            </ul>
        </div> */}
    </>
  );
}

export default App1;
