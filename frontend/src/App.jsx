import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ToDo from "./pages/ToDo.jsx";
import './index.css'

function App() {
  return (
    <div className="main" style={{ fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <ToDo />
    </div>
  );
}



export default App;
