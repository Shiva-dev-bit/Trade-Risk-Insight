import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";
import axios from "axios";
import PropTypes from "prop-types";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);

  const fetchStockFromAPI = async (symbol, exchange) => {
    try {
      const response = await axios.get(
        `https://rcapidev.neosme.co:2053/search/${symbol}`
      );
      const data = response.data;
      const stockData = data.filter((stock) => stock?.exchange === exchange) || {};
      return { ...stockData };
    } catch (error) {
      console.error(`Error fetching stock for ${symbol}:`, error);
      return {};
    }
  };

  const fetchUserStocks = async (userId) => {
    if (!userId) return;

    try {
      // Fetch portfolio data for the user
      const { data: portfolioData, error } = await supabase
        .from("userPortfolio")
        .select(
          `
          portfolio_id,
          stock_id,
          quantity,
          average_price,
          purchase_date,
          symbol,
          exchange,
          is_deleted_yn,
          stocks(*)
        `
        )
        .eq("user_id", userId)
        .eq("is_deleted_yn", false);

      if (error) throw new Error(`Error fetching portfolio: ${error.message}`);

      // Fetch and enrich stocks with live prices
      const enrichedStocks = await Promise.all(
        portfolioData.map(async (item) => {
          if (!item) return null;

          const stockSymbol = item.symbol ?? item.stocks?.symbol;
          const stockExchange = item.exchange ?? item.stocks?.exchange;

          if (!stockSymbol || !stockExchange) return null;

          let livePrice = null;
          if (item.stock_id) {
            const { data: priceData, error: priceError } = await supabase
              .from("price")
              .select("price")
              .eq("symbol", stockSymbol)
              .eq("exchange", stockExchange)
              .single();

            livePrice = priceError || !priceData
              ? (await fetchStockFromAPI(stockSymbol, stockExchange)).close
              : priceData.price;
          } else {
            livePrice = (await fetchStockFromAPI(stockSymbol, stockExchange)).close;
          }

          return {
            ...item,
            live_price: livePrice || "N/A",
            symbol: stockSymbol,
            exchange: stockExchange,
          };
        })
      );

      setStocks(enrichedStocks.filter(Boolean));
    } catch (error) {
      console.error("Error in fetchUserStocks:", error);
    }
  };

  return (
    <StockContext.Provider value={{ stocks, fetchUserStocks }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  return useContext(StockContext);
};

StockProvider.propTypes = {
  children: PropTypes.node.isRequired, // 'children' must be a valid React node and is required
};
