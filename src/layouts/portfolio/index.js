// import { Box, Typography } from "@mui/material";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { supabase } from "lib/supabase";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import StockList from "./components/StockList";
// import Header from "./components/Header";

// const Portfolio = () => {
//   const [stocks, setStocks] = useState([]);
//   const userId = 1;

//   const fetchStockFromAPI = async (symbol, exchange) => {
//     try {
//       const response = await axios.get(
//         `https://983c-223-178-80-57.ngrok-free.app/search/${symbol}`
//       );
//       const data = response.data;
//       return data.find((stock) => stock.exchange === exchange) || {};
//     } catch (error) {
//       console.error(`Error fetching stock for ${symbol}:`, error);
//       return {}; // Return empty object in case of error
//     }
//   };

//   const fetchUserStocks = async () => {
//     const { data, error } = await supabase
//       .from("userPortfolio")
//       .select(
//         "portfolio_id, stock_id, quantity, average_price, symbol, exchange, is_deleted_yn, stocks(*), users(*)"
//       )
//       .eq("user_id", userId)
//       .eq("is_deleted_yn", false);

//     if (error) {
//       console.error("Error fetching stocks:", error);
//       return;
//     }

//     // Check for missing stock_id and fetch data from API if necessary
//     const enrichedStocks = await Promise.all(
//       data.map(async (item) => {
//         if (!item.stock_id) {
//           const stockData = await fetchStockFromAPI(item.symbol, item.exchange);
//           return { ...item, stocks: stockData }; // Add API data to the item
//         }
//         return item;
//       })
//     );

//     setStocks(enrichedStocks);
//   };

//   useEffect(() => {
//     fetchUserStocks();
//   }, []);

//   return (
//     <DashboardLayout>
//       <Box display="flex" flexDirection="column" gap={2}>
//         <Header username={stocks[0]?.users?.username} email={stocks[0]?.users?.email} />
//         <StockList
//           stocks={stocks}
//           fetchUserStocks={fetchUserStocks}
//           fetchStockFromAPI={fetchStockFromAPI}
//         />
//       </Box>
//     </DashboardLayout>
//   );
// };

// export default Portfolio;

import { Box, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { supabase } from "lib/supabase";
import React, { useEffect, useState } from "react";
import axios from "axios";
import StockList from "./components/StockList";
import Header from "./components/Header";

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const userId = 1;

  const fetchStockFromAPI = async (symbol, exchange) => {
    try {
      const response = await axios.get(
        `https://4fdf-223-178-80-57.ngrok-free.app/search/${symbol}`
      );
      const data = response.data;
      const stockData = data.filter((stock) => stock?.exchange === exchange) || {};
      // return stockData;
      return {
        ...stockData,
      };
    } catch (error) {
      console.error(`Error fetching stock for ${symbol}:`, error);
      return {};
    }
  };

  const fetchUserStocks = async () => {
    const { data, error } = await supabase
      .from("userPortfolio")
      .select(
        `
        portfolio_id,
        stock_id,
        quantity,
        average_price,
        symbol,
        exchange,
        is_deleted_yn,
        stocks(*),
        users(*)
      `
      )
      .eq("user_id", userId)
      .eq("is_deleted_yn", false);

    if (error) {
      console.error("Error fetching stocks:", error);
      return;
    }

    // Fetch prices for all stocks
    const enrichedStocks = await Promise.all(
      data.map(async (item) => {
        const stockSymbol = item?.symbol ? item?.symbol : item?.stocks?.symbol;
        const stockExchange = item?.exchange ? item?.exchange : item?.stocks?.exchange;
        let priceData = null;

        if (item.stock_id) {
          const { data: latestPrice, error: priceError } = await supabase
            .from("price")
            .select("price")
            .eq("symbol", stockSymbol)
            .eq("exchange", stockExchange);

          if (priceError) {
            console.error("Error fetching price:", priceError);
            const apiData = await fetchStockFromAPI(stockSymbol, stockExchange);
            priceData = apiData[0]?.close;
          } else {
            priceData = latestPrice[0]?.price;
          }
        } else {
          // Fetch from external API if no stock_id
          const stockData = await fetchStockFromAPI(stockSymbol, stockExchange);
          priceData = stockData[0]?.close;
        }

        return {
          ...item,
          live_price: priceData,
          symbol: stockSymbol,
          exchange: stockExchange,
        };
      })
    );

    setStocks(enrichedStocks);
  };

  useEffect(() => {
    fetchUserStocks();

    // Set up real-time subscription for price updates
    const priceSubscription = supabase
      .channel("price-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "price",
        },
        (payload) => {
          setStocks((currentStocks) =>
            currentStocks.map((stock) => {
              if (
                stock.stocks.symbol === payload.new.symbol &&
                stock.stocks.exchange === payload.new.exchange
              ) {
                return {
                  ...stock,
                  live_price: payload.new.price,
                };
              }
              return stock;
            })
          );
        }
      )
      .subscribe();

    return () => {
      priceSubscription.unsubscribe();
    };
  }, []);

  return (
    <DashboardLayout>
      <Box display="flex" flexDirection="column" gap={2} >
        <Header username={stocks[0]?.users?.username} email={stocks[0]?.users?.email} />
        <StockList
          stocks={stocks}
          fetchUserStocks={fetchUserStocks}
          fetchStockFromAPI={fetchStockFromAPI}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Portfolio;
