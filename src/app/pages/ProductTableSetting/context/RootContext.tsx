import React, { useContext, useMemo, useState } from 'react';

interface RootContextProps {
  showPrice: boolean;
  setShowPrice: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RootContextProviderProps {
  value: RootContextProps;
}

const RootContext = React.createContext<RootContextProps>(
  {} as RootContextProps,
);

export const ProductTableProvider: React.FC<RootContextProviderProps> = ({
  children,
  value,
}) => {
  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};

export const useProductTableContext = () => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error(
      'useProductTableContext must be used within RootContextProvider',
    );
  }
  return context;
};
