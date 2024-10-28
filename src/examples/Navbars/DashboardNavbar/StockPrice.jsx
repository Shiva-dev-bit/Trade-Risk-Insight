// import { Box, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
// import { FaCaretDown, FaCaretUp } from "react-icons/fa";

// const StockPrice = ({ symbol, mic_code, percent_change, close, supabase, source }) => {
//   const [priceData, setPriceData] = useState([]);
//   const [stocksPercent, setStocksPercent] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchDailyStock = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("stock_daily_summary")
//           .select("*")
//           .eq("symbol", symbol);

//         if (error) throw error;
//         if (data) setStocksPercent(data);
//       } catch (error) {
//         console.log("Error fetching stocks:", error);
//       }
//     };

//     const fetchPriceData = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("price")
//           .select("*")
//           .eq("symbol", symbol)
//           .eq("mic_code", mic_code)
//           .order("updated_at", { ascending: false });

//         if (error) throw error;
//         if (data) setPriceData(data);
//       } catch (error) {
//         console.error("Error fetching prices:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (source === "supabase") {
//       fetchPriceData();
//       fetchDailyStock();
//     } else {
//       // For API data, we'll use the provided close and percent_change
//       setIsLoading(false);
//     }
//   }, [symbol, supabase, source]);

//   const getDisplayPrice = () => {
//     if (source === "api") {
//       return close || "";
//     }

//     if (!priceData.length) return null;
//     return priceData[0]?.price; // Get the most recent price
//   };

//   const getDisplayPercentage = () => {
//     if (source === "api") {
//       return percent_change ? parseFloat(percent_change) : null;
//     }
//     return stocksPercent.length > 0 ? parseFloat(stocksPercent[0]?.percentage_change) : null;
//   };

//   const price = getDisplayPrice();
//   const percentageChange = getDisplayPercentage();

//   if (isLoading) return <Typography></Typography>;
//   if (!price && source === "supabase") return <Typography></Typography>;

//   const color = percentageChange >= 0 ? "#4CAF50" : "#FF5252";

//   const formattedPrice =
//     typeof price === "number" || typeof price === "string"
//       ? new Intl.NumberFormat("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(parseFloat(price))
//       : "";

//   return (
//     <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//       <Typography sx={{ color: "white", fontSize: "16px" }}>{formattedPrice}</Typography>
//       {percentageChange !== null && (
//         <Typography
//           sx={{
//             color,
//             fontSize: "16px",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           {percentageChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
//           {Math.abs(percentageChange).toFixed(2)}%
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default StockPrice;

import { Box, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const StockPrice = ({ symbol, mic_code, percent_change, close, supabase, source }) => {
  const [priceData, setPriceData] = useState(null); // Store only the latest price
  const [percentageChange, setPercentageChange] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (source === "api") {
      // Use provided API data directly
      setPriceData(close || null);
      setPercentageChange(percent_change ? parseFloat(percent_change) : null);
      setIsLoading(false);
      return;
    }

    const fetchStockData = async () => {
      try {
        const [priceRes, percentRes] = await Promise.all([
          supabase
            .from("price")
            .select("price")
            .eq("symbol", symbol)
            .eq("mic_code", mic_code)
            .order("updated_at", { ascending: false })
            .limit(1), // Fetch only the latest entry

          supabase
            .from("stock_daily_summary")
            .select("percentage_change")
            .eq("symbol", symbol)
            .limit(1),
        ]);

        if (priceRes.error) throw priceRes.error;
        if (percentRes.error) throw percentRes.error;

        setPriceData(priceRes.data[0]?.price || null);
        setPercentageChange(percentRes.data[0]?.percentage_change || null);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol && mic_code) fetchStockData(); // Only fetch if valid inputs are available
  }, [symbol, mic_code, supabase, source]);

  const formattedPrice = useMemo(() => {
    if (priceData === null) return "";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceData);
  }, [priceData]);

  if (isLoading) return <Typography></Typography>;
  if (!priceData && source === "supabase") return <Typography></Typography>;

  const color = percentageChange >= 0 ? "#4CAF50" : "#FF5252";

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Typography sx={{ color: "white", fontSize: "16px" }}>{formattedPrice}</Typography>
      {percentageChange !== null && (
        <Typography
          sx={{
            color,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {percentageChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
          {Math.abs(percentageChange).toFixed(2)}%
        </Typography>
      )}
    </Box>
  );
};

export default StockPrice;
