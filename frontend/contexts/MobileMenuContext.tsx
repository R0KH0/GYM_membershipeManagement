import React, { createContext, useContext } from 'react';

interface MobileMenuContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const MobileMenuContext = createContext<MobileMenuContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);