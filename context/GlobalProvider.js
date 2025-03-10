import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";


const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => { 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              const res = await getCurrentUser();
              console.log("USER:", res);
              if (res) {
                console.log("Global Provider 1")
                  setIsLoggedIn(true);
                  console.log("Global Provider 2")
                  setUser(res);
                  console.log("Global Provider 3")
                  await AsyncStorage.setItem("user", JSON.stringify(res)); // Store user data
              } else {
                console.log("Global Provider 4")
                  setIsLoggedIn(false);
                  console.log("Global Provider 5")
                  setUser(null);
                  console.log("Global Provider 6")
                  await AsyncStorage.removeItem("user");
              }
          } catch (error) {
              console.error("Error fetching user:", error);
          } finally {
              setIsLoading(false);
          }
      };
      fetchUser();
  }, []);

  return (
      <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
          {children}
      </GlobalContext.Provider>
  );
};

export default GlobalProvider