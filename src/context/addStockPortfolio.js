import React, { createContext, useContext } from "react";

// Create a context
const PortfolioContext = createContext();

// Create a provider component
export const PortfolioProvider = ({ children }) => {
  const addStockPortfolio = async (stock) => {
    const { data, error } = await supabase.from("userPortfolio").insert([
      {
        user_id: userId,
        stock_id: stock.id,
        quantity: stock.quantity || 0,
        average_price: stock.price || 0,
        is_deleted_yn: false,
        purchase_date: stock.purchase_date || null,
      },
    ]);

    if (error) {
      console.error("Error adding stock:", error);
    } 
    else {
      console.log("Stock added successfully:", data);
      fetchUserStocks();
    }
  };

  return (
    <PortfolioContext.Provider value={{ addStockPortfolio }}>{children}</PortfolioContext.Provider>
  );
};

// Hook to use the PortfolioContext
export const usePortfolio = () => useContext(PortfolioContext);
