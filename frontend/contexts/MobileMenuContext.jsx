import React, { createContext, useContext } from 'react';

export const MobileMenuContext = createContext({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);