import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { MdDelete } from "react-icons/md";
import { Box, Button, Snackbar, SnackbarContent, Typography } from "@mui/material";
import { supabase } from "lib/supabase";
import { useEffect, useState } from "react";

const StockList = ({ stocks, fetchUserStocks, fetchStockFromAPI }) => {
  const {
    gradients: { card },
  } = colors;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [companyNames, setCompanyNames] = useState({});

  const fetchCompanyName = async (symbol, exchange) => {
    try {
      const response = await fetch(`https://22eb-223-178-82-244.ngrok-free.app/search/${symbol}`);
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
    return companyName || `${stock.symbol} (${stock.exchange})`;
  };

  useEffect(() => {
    // Fetch company names for all stocks
    stocks.forEach((stock) => {
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
      // location.reload();
    }
  };

  const formatPrice = (price) => {
    console.log("price", price);
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
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
        mb: 3.5,
        borderRadius: "15px",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          color="#fff"
          sx={{
            textTransform: "capitalize",
            mb: { xs: 3, sm: 4, md: 5 },
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          Stock Lists
        </Typography>
      </Box>

      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {stocks.length > 0
          ? stocks.map((stock) => {
              const profit = calculateProfit(stock.quantity, stock.live_price, stock.average_price);
              const percentGain = calculatePercentGain(stock.live_price, stock.average_price);
              const totalValue = calculateTotalValue(stock.quantity, stock.live_price);
              const totalInvestment = calculateTotalInvestment(stock.quantity, stock.average_price);
              const holdingDays = getHoldingPeriod(stock.created_at);

              return (
                <Box
                  key={stock.portfolio_id}
                  component="li"
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                    color: "#fff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 2, sm: 3 },
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="button"
                      color="white"
                      fontWeight="medium"
                      textTransform="capitalize"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        flexBasis: { sm: "30%" },
                      }}
                    >
                      {/* {stock?.stocks?.company_name || `${stock.symbol} (${stock.exchange})`} */}
                      {getDisplayName(stock)}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 3 },
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexGrow: 1,
                      }}
                    >
                      {/* <Typography variant="caption" color="text">
                        Bought Date:{" "}
                        <Typography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          component="span"
                        >
                          {formatDate(stock?.created_at)} ({holdingDays} days)
                        </Typography>
                      </Typography> */}

                      <Typography variant="caption" color="text">
                        Quantity:{" "}
                        <Typography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          component="span"
                        >
                          {stock?.quantity}
                        </Typography>
                      </Typography>

                      <Typography variant="caption" color="text">
                        Bought Price:{" "}
                        <Typography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          component="span"
                        >
                          {formatPrice(stock?.average_price)}
                        </Typography>
                      </Typography>

                      <Typography variant="caption" color="text">
                        Current Price:{" "}
                        <Typography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          component="span"
                        >
                          {formatPrice(stock?.live_price)}
                        </Typography>
                      </Typography>

                      <Typography variant="caption" color="text">
                        Investment:{" "}
                        <Typography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          component="span"
                        >
                          {formatPrice(totalInvestment)}
                        </Typography>
                      </Typography>

                      <Typography
                        variant="caption"
                        color={profit >= 0 ? "#4CAF50" : "#FF4040"}
                        fontWeight="medium"
                      >
                        P/L: {formatPrice(profit)} ({percentGain >= 0 ? "+" : ""}
                        {percentGain.toFixed(2)}%)
                      </Typography>

                      <Typography variant="caption" color="text" fontWeight="medium">
                        Current Value: {formatPrice(totalValue)}
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2}>
                      <Button
                        variant="text"
                        onClick={() => deleteStock(stock)}
                        sx={{
                          minWidth: "auto",
                          p: 1,
                          color: "#FF4040",
                          "&:hover": { backgroundColor: "#ffffff", color: "#FF0000" },
                        }}
                      >
                        <MdDelete size={20} />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })
          : "No Stocks is added"}
      </Box>

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
