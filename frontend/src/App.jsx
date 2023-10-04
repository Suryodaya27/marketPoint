import React from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import ProductList from './pages/Products';
import { Product } from './components/Product';
import Cart from './pages/Cart';
import {Checkout} from './components/Checkout'
import { Signin } from './components/Signin';
import { Signup } from './components/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const { user } = useAuth(); // Use the useAuth hook to access the user object

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:productId" element={<Product/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
