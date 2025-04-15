import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

const defaultOrderData = {
  shop: "",
  orderCap: "",
  deliveryDate: null,
  orderCutOffDate: null,
  dropOffAddress: "",
  dropOffCoordinates: {
    latitude: 0,
    longitude: 0,
  },
  dropOffRange: 0,
};

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState(defaultOrderData);

  const resetOrderData = () => {
    setOrderData(defaultOrderData);
  };

  return (
    <OrderContext.Provider
      value={{
        orderData,
        setOrderData,
        resetOrderData, // 👈 include this in context
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
