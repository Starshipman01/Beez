import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState({
    shop: "",
    orderCap: "",
    deliveryDate: null,
    orderCutOffDate: null,
    dropOffBlock: "",
    dropOffAddress: "",
    dropOffCoordinates: {
      latitude: 0,
      longitude: 0,
    },
  });

  return (
    <OrderContext.Provider value={{ orderData, setOrderData }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
