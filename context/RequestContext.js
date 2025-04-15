import React, { createContext, useContext, useState } from "react";

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requestData, setRequestData] = useState({
    dropOffAddress: "",
    dropOffCoordinates: {
      latitude: 0,
      longitude: 0,
    },
    dropOffRange: 0,
  });

  return (
    <RequestContext.Provider value={{ requestData, setRequestData }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => useContext(RequestContext);
