import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');


    document.documentElement.setAttribute('data-theme', theme);
 

  const handleTheme = () => {
    setTheme((a) => (a === 'light' ? 'dark' : 'light'));
  };

  return (
    <GlobalContext.Provider value={{ theme, handleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
