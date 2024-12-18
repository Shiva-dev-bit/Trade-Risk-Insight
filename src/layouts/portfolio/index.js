import { Box, Button, CircularProgress, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
// import { Button } from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { supabase } from "lib/supabase";
import React, { useContext, useEffect, useState } from "react";
import StockList from "./components/StockList";
import Header from "./components/Header";
import { AuthContext } from "context/Authcontext";
import Footer from "examples/Footer";
import axios from "axios";

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [userData, setUserData] = useState();
  const [userId, setUserId] = useState(null);

  const { session } = useContext(AuthContext);

  const getUserData = async () => {
    if (!session?.user?.email) return;

    const { data: userMail, error } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", session?.user?.email)
      .single();

    if (error) {
      console.error("Error fetching user id:", error);
      return;
    }

    const { data: userdatas, error: userdataError } = await supabase
      .from("users")
      .select("*")
      .eq("email", session?.user?.email)
      .single();

    if (userdataError) {
      console.error("Error fetching user data:", error);
      return;
    }

    if (userMail) {
      setUserId(userMail?.user_id);
      setUserData(userdatas);
    }
  };

  const fetchStockFromAPI = async (symbol, exchange) => {

    try {
      const response = await axios.get(
        `https://rcapidev.neosme.co:2053/search/${symbol}`
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
    if (!userId) return;

    try {
      // Step 1: Fetch portfolio data for the user
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
          stocks(*),
          users(*)
        `
        )
        .eq("user_id", userId)
        .eq("is_deleted_yn", false);

      if (error) throw new Error(`Error fetching portfolio: ${error.message}`);

      // Step 2: Fetch and enrich stocks with live prices
      const enrichedStocks = await Promise.all(
        portfolioData.map(async (item) => {
          // Ensure item exists and is not null
          if (!item) {
            console.warn("Portfolio item is null or undefined:", item);
            return null;
          }

          // Check for symbol and exchange in both `item` and `item.stocks`
          const stockSymbol = item.symbol ?? item.stocks?.symbol;
          const stockExchange = item.exchange ?? item.stocks?.exchange;

          // Log a warning if either symbol or exchange is missing and skip this item
          if (!stockSymbol || !stockExchange) {
            console.warn("Missing stock symbol or exchange for item:", item);
            return null; // Skip this item
          }

          // Try fetching the price from the database first
          let livePrice = null;
          if (item.stock_id) {
            const { data: priceData, error: priceError } = await supabase
              .from("price")
              .select("price")
              .eq("symbol", stockSymbol)
              .eq("exchange", stockExchange)
              .single(); // Use single() to fetch a single matching row

            // Use price from database if available, else fetch from API
            if (priceError || !priceData) {
              console.warn(`Price not found in database for ${stockSymbol}. Fetching from API.`);
              const apiData = await fetchStockFromAPI(stockSymbol, stockExchange);
              livePrice = apiData?.[0]?.close;
            } else {
              livePrice = priceData.price;
            }
          } else {
            // If no stock_id, fallback to API for price
            const apiData = await fetchStockFromAPI(stockSymbol, stockExchange);
            livePrice = apiData?.[0]?.close;
          }

          return {
            ...item,
            live_price: livePrice || "N/A", // Fallback if price data is unavailable
            symbol: stockSymbol,
            exchange: stockExchange,
          };
        })
      );

      // Step 3: Filter out null values from the enriched stocks list
      setStocks(enrichedStocks.filter(Boolean));
    } catch (error) {
      console.error("Error in fetchUserStocks:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [session]);

  useEffect(() => {
    if (userId) {
      fetchUserStocks();
    }

    // Set up real-time subscription for price updates
    // const priceSubscription = supabase
    //   .channel("price-updates")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "*",
    //       schema: "public",
    //       table: "price",
    //     },
    //     (payload) => {
    //       setStocks((currentStocks) =>
    //         currentStocks.map((stock) => {
    //           if (
    //             stock?.stocks?.symbol === payload?.new?.symbol &&
    //             stock?.stocks?.exchange === payload?.new?.exchange
    //           ) {
    //             return {
    //               ...stock,
    //               live_price: payload?.new?.price,
    //             };
    //           }
    //           return stock;
    //         })
    //       );
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(priceSubscription);
    // };

  }, [userId]);


  return (
    <DashboardLayout>

      {/* Show loader if user data is still loading */}
      {stocks.length === 0 && userData === undefined && (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
          <CircularProgress /> {/* Loader */}
        </Box>
      )}

      {/* Show sign-in message if user is not logged in */}
      {!userId && (
        <Box my={"15%"} mx={"28%"} sx={{ height: "27vh" }}>
          <Button
            component={Link}
            variant="contained"
            to="/authentication/sign-in"
            sx={{ background: "#0047AB", fontSize: "15px" }}
          >
            Sign in to add your stocks in the portfolio or to see the existing stocks you added
          </Button>
        </Box>
      )}

      {/* Show the main dashboard content if the user is logged in */}
      {userId && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Header username={userData?.username} email={userData?.email} stocks={stocks} />
          <StockList
            stocks={stocks}
            fetchUserStocks={fetchUserStocks}
          // fetchStockFromAPI={fetchStockFromAPI}
          />
        </Box>
      )}

      <Footer />
    </DashboardLayout>

  );
};

export default Portfolio;


