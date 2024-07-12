import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [manager, setManager] = useState(JSON.parse(localStorage.getItem('manager')) || null);

  useEffect(() => {
    if (manager) {
      localStorage.setItem('manager', JSON.stringify(manager));
    } else {
      localStorage.removeItem('manager');
    }
  }, [manager]);

  const login = (managerData) => {
    setManager(managerData);
  };

  const logout = () => {
    setManager(null);
  };

  const contextValue = {
    manager,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Rename managerAuth to useManagerAuth
export const useManagerAuth = () => useContext(AuthContext);
