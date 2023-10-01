// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the token exists and is not expired
    const token = localStorage.getItem('authToken');
    if (token) {
      const expirationTime = localStorage.getItem('authTokenExpiration');
      if (expirationTime && new Date().getTime() < parseInt(expirationTime, 10)) {
        setUser({ token });
      } else {
        // Token has expired, remove it
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiration');
        setUser(null);
      }
    } else {
      // Token does not exist, set the user to null
      setUser(null);
    }
  }, [localStorage.getItem('authToken')]); // Add token as a dependency

  const login = (token) => {
    const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expirationTime);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
    setUser(null);
  };

  const checkTokenExpiration = () => {
    const expirationTime = localStorage.getItem('authTokenExpiration');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        // Token has expired, remove it and log the user out
        logout();
      }
    }
  };

  useEffect(() => {
    // Check if the token exists and is not expired
    const token = localStorage.getItem('authToken');
    if (token) {
      const expirationTime = localStorage.getItem('authTokenExpiration');
      if (expirationTime && new Date().getTime() < parseInt(expirationTime, 10)) {
        setUser({ token });
      } else {
        // Token has expired, remove it and log the user out
        logout();
      }
    } else {
      // Token does not exist, set the user to null
      setUser(null);
    }

    // Set up the token expiration check interval
    const tokenExpirationCheckInterval = setInterval(
      checkTokenExpiration,
      60000 // 1 minute
    );

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(tokenExpirationCheckInterval);
    };
  }, []);


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
