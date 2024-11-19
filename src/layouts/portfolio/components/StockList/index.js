import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { MdDelete } from "react-icons/md";
import { Box, Button, Snackbar, SnackbarContent, Typography } from "@mui/material";
import { supabase } from "lib/supabase";
import { useEffect, useState } from "react";

const StockList = ({ stocks, fetchUserStocks }) => {
  const {
    gradients: { card },
  } = colors;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [companyNames, setCompanyNames] = useState({});

  console.log('companyNames',companyNames);

  const fetchCompanyName = async (symbol, exchange) => {
    try {
      const response = await fetch(`https://216b-223-178-84-15.ngrok-free.app/search/${symbol}`);
      const data = await response.json();

      // Find the matching company based on both symbol and exchange
      const matchingCompany = data.find(
        (company) =>
          company.symbol.toUpperCase() === symbol.toUpperCase() &&
          company.exchange.toUpperCase() === exchange.toUpperCase()
      );

      if (matchingCompany) {
        setCompanyNames((prev) => ({
          ...prev,
          [`${symbol}-${exchange}`]: matchingCompany.company_name,
        }));
      }
    } catch (error) {
      console.error("Error fetching company name:", error);
    }
  };

  const getDisplayName = (stock) => {
    const companyName = companyNames[`${stock.symbol}-${stock.exchange}`];
    return companyName
      ? `${companyName} (${stock.symbol}) (${stock.exchange})`
      : `${stock.symbol} (${stock.exchange})`;
  };

  useEffect(() => {
    // Fetch company names for all stocks
    stocks.forEach((stock) => {
       console.log('Portfoliostock',stock);

      if (!companyNames[`${stock.symbol}-${stock.exchange}`]) {
        fetchCompanyName(stock.symbol, stock.exchange);
      }
    });
  }, [stocks]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const deleteStock = async (stock) => {
    const { error } = await supabase
      .from("userPortfolio")
      .update({ is_deleted_yn: true })
      .eq("portfolio_id", stock?.portfolio_id);

    if (error) {
      console.error("Error deleting stock:", error);
    } else {
      setSnackbarMessage(
        `${stock?.stocks?.company_name || stock?.symbol} has been removed from your portfolio!`
      );
      setSnackbarOpen(true);
      fetchUserStocks();
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      // maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent) => {
    console.log("percentpercentpercent", percent);
    if (isNaN(percent)) return "";
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  const calculateProfit = (quantity, livePrice, averagePrice) => {
    if (!quantity || !livePrice || !averagePrice) return 0;
    return quantity * (livePrice - averagePrice);
  };

  const calculatePercentGain = (livePrice, averagePrice) => {
    if (!livePrice || !averagePrice) return 0;
    return ((livePrice - averagePrice) / averagePrice) * 100;
  };

  const calculateTotalValue = (quantity, livePrice) => {
    if (!quantity || !livePrice) return 0;
    return quantity * livePrice;
  };

  const calculateTotalInvestment = (quantity, averagePrice) => {
    if (!quantity || !averagePrice) return 0;
    return quantity * averagePrice;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getHoldingPeriod = (dateString) => {
    if (!dateString) return "N/A";
    const boughtDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - boughtDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box
      sx={{
        background: linearGradient(card.main, card.state, card.deg),
        borderRadius: "15px",
        p: 3,
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontSize: "1.25rem",
          mb: 4,
          fontWeight: 400,
        }}
      >
        Stock Lists
      </Typography>

      {/* Headers */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          p: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{ color: "#fff", flex: 2, fontSize: "17px", fontWeight: 600, textAlign: "center" }}
        >
          Company Name
        </Typography>
        <Typography
          sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
        >
          Quantity
        </Typography>
        <Typography
          sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
        >
          Bought Price
        </Typography>
        <Typography
          sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
        >
          Current Price
        </Typography>
        <Typography
          sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
        >
          Investment
        </Typography>
        <Typography
          sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
        >
          P/L
        </Typography>
        <Typography
          sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
        >
          Current Value
        </Typography>
        <Box sx={{ width: 48 }} />
      </Box>

      {stocks.length > 0 ? (
        stocks.map((stock) => {
          const profit = calculateProfit(stock?.quantity, stock?.live_price, stock?.average_price);
          const percentGain = calculatePercentGain(stock?.live_price, stock?.average_price);
          const totalValue = calculateTotalValue(stock?.quantity, stock?.live_price);
          const totalInvestment = calculateTotalInvestment(stock?.quantity, stock?.average_price);

          return (
            <Box
              key={stock.portfolio_id}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                p: 2,
                mb: 2,
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  textAlign: "center",
                  flex: 2,
                  fontSize: "17px",
                  fontWeight: 400,
                }}
              >
                {getDisplayName(stock)}
              </Typography>
              <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
                {stock?.quantity}
              </Typography>
              <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
                {formatPrice(stock?.average_price)}
              </Typography>
              <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
                {/* {formatPrice(stock?.live_price) ? formatPrice(stock?.live_price) : "-"} */}
                {formatPrice(stock?.live_price)}
              </Typography>
              <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
                {formatPrice(totalInvestment)}
              </Typography>
              <Typography
                sx={{
                  color: profit >= 0 ? "#4CAF50" : "#FF4040",
                  flex: 1,
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                {/* {formatPrice(profit)} ({percentGain >= 0 ? "+" : ""}
                {isNaN(percentGain) ? "-%)" : `${percentGain.toFixed(2)}%`} */}
                {formatPrice(profit)}{" "}
                {formatPercent(percentGain) ? `${formatPercent(percentGain)}` : ""}
              </Typography>
              <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
                {formatPrice(totalValue)}
              </Typography>
              <Box sx={{ width: 48, display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={() => deleteStock(stock)}
                  sx={{
                    minWidth: "auto",
                    p: 1,
                    color: "#FF4040",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <MdDelete size={20} />
                </Button>
              </Box>
            </Box>
          );
        })
      ) : (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            p: 3,
            textAlign: "center",
            color: "#fff",
          }}
        >
          No Stocks is added
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <SnackbarContent
          message={snackbarMessage}
          onClose={handleSnackbarClose}
          sx={{ backgroundColor: "red" }}
        />
      </Snackbar>
    </Box>
  );
};

export default StockList;

// import colors from "assets/theme/base/colors";
// import linearGradient from "assets/theme/functions/linearGradient";
// import { MdDelete } from "react-icons/md";
// import { Box, Button, Snackbar, SnackbarContent, Typography } from "@mui/material";
// import { supabase } from "lib/supabase";
// import { useEffect, useState } from "react";

// const StockList = ({ stocks, fetchUserStocks, fetchStockFromAPI }) => {
//   const {
//     gradients: { card },
//   } = colors;

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [companyNames, setCompanyNames] = useState({});

//   const fetchCompanyName = async (symbol, exchange) => {
//     try {
//       const response = await fetch(`https://216b-223-178-84-15.ngrok-free.app/search/${symbol}`);
//       const data = await response.json();

//       // Find the matching company based on both symbol and exchange
//       const matchingCompany = data.find(
//         (company) =>
//           company.symbol.toUpperCase() === symbol.toUpperCase() &&
//           company.exchange.toUpperCase() === exchange.toUpperCase()
//       );

//       if (matchingCompany) {
//         setCompanyNames((prev) => ({
//           ...prev,
//           [`${symbol}-${exchange}`]: matchingCompany.company_name,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching company name:", error);
//     }
//   };

//   const getDisplayName = (stock) => {
//     const companyName = companyNames[`${stock.symbol}-${stock.exchange}`];
//     return companyName
//       ? `${companyName} (${stock.symbol}) (${stock.exchange})`
//       : `${stock.symbol} (${stock.exchange})`;
//   };

//   useEffect(() => {
//     // Fetch company names for all stocks
//     stocks.forEach((stock) => {
//       if (!companyNames[`${stock.symbol}-${stock.exchange}`]) {
//         fetchCompanyName(stock.symbol, stock.exchange);
//       }
//     });
//   }, [stocks]);

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const deleteStock = async (stock) => {
//     const { error } = await supabase
//       .from("userPortfolio")
//       .update({ is_deleted_yn: true })
//       .eq("portfolio_id", stock?.portfolio_id);

//     if (error) {
//       console.error("Error deleting stock:", error);
//     } else {
//       setSnackbarMessage(
//         `${stock?.stocks?.company_name || stock?.symbol} has been removed from your portfolio!`
//       );
//       setSnackbarOpen(true);
//       fetchUserStocks();
//     }
//   };

//   const formatPrice = (price) => {
//     if (price === null || price === undefined) return "N/A";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 2,
//     }).format(price);
//   };

//   const calculateProfit = (quantity, livePrice, averagePrice) => {
//     if (!quantity || livePrice === null || livePrice === undefined || averagePrice === null || averagePrice === undefined)
//       return 0;
//     return quantity * (livePrice - averagePrice);
//   };

//   const calculatePercentGain = (livePrice, averagePrice) => {
//     if (livePrice === null || livePrice === undefined || averagePrice === null || averagePrice === undefined)
//       return 0;
//     return ((livePrice - averagePrice) / averagePrice) * 100;
//   };

//   const calculateTotalValue = (quantity, livePrice) => {
//     if (!quantity || livePrice === null || livePrice === undefined)
//       return 0;
//     return quantity * livePrice;
//   };

//   const calculateTotalInvestment = (quantity, averagePrice) => {
//     if (!quantity || averagePrice === null || averagePrice === undefined)
//       return 0;
//     return quantity * averagePrice;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   const getHoldingPeriod = (dateString) => {
//     if (!dateString) return "N/A";
//     const boughtDate = new Date(dateString);
//     const today = new Date();
//     const diffTime = Math.abs(today - boughtDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   return (
//     <Box
//       sx={{
//         background: linearGradient(card.main, card.state, card.deg),
//         borderRadius: "15px",
//         p: 3,
//         width: "100%",
//       }}
//     >
//       <Typography
//         variant="h6"
//         sx={{
//           color: "#fff",
//           fontSize: "1.25rem",
//           mb: 4,
//           fontWeight: 400,
//         }}
//       >
//         Stock Lists
//       </Typography>

//       {/* Headers */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           borderRadius: "10px",
//           p: 2,
//           mb: 2,
//         }}
//       >
//         <Typography
//           sx={{ color: "#fff", flex: 2, fontSize: "17px", fontWeight: 600, textAlign: "center" }}
//         >
//           Company Name
//         </Typography>
//         <Typography
//           sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
//         >
//           Quantity
//         </Typography>
//         <Typography
//           sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
//         >
//           Bought Price
//         </Typography>
//         <Typography
//           sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
//         >
//           Current Price
//         </Typography>
//         <Typography
//           sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
//         >
//           Investment
//         </Typography>
//         <Typography
//           sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
//         >
//           P/L
//         </Typography>
//         <Typography
//           sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
//         >
//           Current Value
//         </Typography>
//         <Box sx={{ width: 48 }} />
//       </Box>

//       {stocks.length > 0 ? (
//         stocks.map((stock) => {
//           const profit = calculateProfit(stock.quantity, stock.live_price, stock.average_price);
//           const percentGain = calculatePercentGain(stock.live_price, stock.average_price);
//           const totalValue = calculateTotalValue(stock.quantity, stock.live_price);
//           const totalInvestment = calculateTotalInvestment(stock.quantity, stock.average_price);

//           return (
//             <Box
//               key={stock.portfolio_id}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 backgroundColor: "rgba(255, 255, 255, 0.05)",
//                 borderRadius: "10px",
//                 p: 2,
//                 mb: 2,
//                 fontSize: "13px",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 255, 255, 0.1)",
//                 },
//               }}
//             >
//               <Typography
//                 sx={{
//                   color: "#fff",
//                   textAlign: "center",
//                   flex: 2,
//                   fontSize: "17px",
//                   fontWeight: 400,
//                 }}
//               >
//                 {getDisplayName(stock)}
//               </Typography>
//               <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
//                 {stock.quantity}
//               </Typography>
//               <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
//                 {formatPrice(stock.average_price)}
//               </Typography>
//               <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
//                 {formatPrice(stock.live_price)}
//               </Typography>
//               <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
//                 {formatPrice(totalInvestment)}
//               </Typography>
//               <Typography
//                 sx={{
//                   color: profit >= 0 ? "#4CAF50" : "#FF4040",
//                   flex: 1,
//                   fontSize: "13px",
//                   textAlign: "center",
//                 }}
//               >
//                 {formatPrice(profit)} ({percentGain >= 0 ? "+" : ""}
//                 {percentGain.toFixed(2)}%)
//               </Typography>
//               <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
//                 {formatPrice(totalValue)}
//               </Typography>
//               <Box sx={{ width: 48, display: "flex", justifyContent: "center" }}>
//                 <Button
//                   onClick={() => deleteStock(stock)}
//                   sx={{
//                     minWidth: "auto",
//                     p: 1,
//                     color: "#FF4040",
//                     "&:hover": {
//                       backgroundColor: "rgba(255, 255, 255, 0.1)",
//                     },
//                   }}
//                 >
//                   <MdDelete size={20} />
//                 </Button>
//               </Box>
//             </Box>
//           );
//         })
//       ) : (
//         <Box
//           sx={{
//             backgroundColor: "rgba(255, 255, 255, 0.05)",
//             borderRadius: "10px",
//             p: 3,
//             textAlign: "center",
//             color: "#fff",
//           }}
//         >
//           No Stocks is added
//         </Box>
//       )}

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <SnackbarContent
//           message={snackbarMessage}
//           onClose={handleSnackbarClose}
//           sx={{ backgroundColor: "red" }}
//         />
//       </Snackbar>
//     </Box>
//   );
// };

// export default StockList;
