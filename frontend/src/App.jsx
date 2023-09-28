import React from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import { Navbar } from './components/Navbar';
import ProductList from './pages/Products';
import Cart from './pages/Cart';
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
            element={user ? <Cart /> : <Signin />} // Render Cart if the user is authenticated
          />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
