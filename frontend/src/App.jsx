import React, { useState } from 'react';
import { Navbar } from "./components/Navbar";
import ProductList from "./pages/Products";
import Cart from "./pages/Cart";
import {Signin} from "./components/Signin";
import {Signup} from "./components/Signup";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  const token = useState(localStorage.getItem('authToken'));
  console.log(token)

  return (
    <>
      <Router>
      <Routes>
        <Route
          path="/"
          element={<ProductList  />}
        />
        <Route path="/cart" element={token ? <Cart /> : <Signin/>} />
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
