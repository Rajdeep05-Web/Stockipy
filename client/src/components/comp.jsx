import { useSelector } from "react-redux";
import React from "react";

export default function Comp1 () {

    const count = useSelector((state) => state.counter);

    return (
        <div>
            <h1>{count}</h1>
        </div>
    )
}

