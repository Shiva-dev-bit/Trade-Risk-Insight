import React, { createContext, useState, useEffect } from "react";
import { supabase } from "/src/lib/supabase";
import PropTypes from "prop-types";

// Create AuthContext
export const AuthContext = createContext();

// AuthContext Provider component
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [typeStock,setTypeStock] = useState('');

  useEffect(() => {
    const fetchSessionAndUser = async () => {
      // Check the initial session from Supabase
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);

      // Listen for changes to the authentication state
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
      });

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    fetchSessionAndUser();
  }, []);

  const storeStockData = (data) => {
    setStockData(data);
  };

  

  return (
    <AuthContext.Provider value={{ session, stockData, storeStockData , setTypeStock}}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // 'children' must be a valid React node and is required
};