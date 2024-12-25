/**
=========================================================
* RiskCompass AI React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Tooltip from "@mui/material/Tooltip";

// RiskCompass AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import { MdDelete } from "react-icons/md";
import { Box, Button, Card, Grid, Modal, Snackbar, SnackbarContent, Typography } from "@mui/material";
import { supabase } from "lib/supabase";
import { useEffect, useState } from "react";
import Table from "examples/Tables/Table";
// import SoftTypography from "components/SoftTypography";
// import SoftBox from "components/SoftBox";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import PropTypes from "prop-types";
import TodoCard from "../TodoCard";

function Messages({ stocks, fetchUserStocks }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [companyNames, setCompanyNames] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);



  const fetchCompanyName = async (symbol, exchange) => {

    try {
      const response = await fetch(`https://rcapidev.neosme.co:2053/search/${symbol}`);
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
      console.log('Portfoliostock', stock);

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

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
  };

  const columns = [
    { name: "companyName", align: "left" },
    { name: "quantity", align: "center" },
    { name: "purchasePrice", align: "center" },
    { name: "purchaseDate", align: "center" },
    { name: "currentPrice", align: "center" },
    { name: "investment", align: "center" },
    { name: "profitLoss", align: "center" },
    { name: "currentValue", align: "center" },
    { name: "", align: "center" },
  ];

  const rows = stocks.length > 0
    ? stocks.map((stock) => {
      const profit = calculateProfit(stock?.quantity, stock?.live_price, stock?.average_price);
      const percentGain = calculatePercentGain(stock?.live_price, stock?.average_price);
      const totalValue = calculateTotalValue(stock?.quantity, stock?.live_price);
      const totalInvestment = calculateTotalInvestment(stock?.quantity, stock?.average_price);

      return {
        companyName: (
          <Typography
            sx={{
              color: "black",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 400,
              cursor: "pointer",
              whiteSpace: "normal", // Enables text wrapping
              wordWrap: "break-word", // Breaks long words if needed
              wordBreak: "break-word", // Ensures words break properly
              minWidth: "120px", // Minimum width to prevent too narrow wrapping
              maxWidth: "200px", // Maximum width to maintain layout
              lineHeight: "1.2", // Tighter line height for wrapped text
              padding: "4px", // Add some padding for better readability
              "&:hover": {
                textDecoration: "underline"
              },
            }}
            onClick={() => handleStockClick(stock)}
          >
            {getDisplayName(stock)}
          </Typography>
        ),
        quantity: (
          <Typography sx={{ color: "black", textAlign: "center", fontSize: "12px" }}>
            {stock?.quantity}
          </Typography>
        ),
        purchasePrice: (
          <Typography sx={{ color: "black", textAlign: "center", fontSize: "12px" }}>
            {formatPrice(stock?.average_price)}
          </Typography>
        ),
        purchaseDate: (
          <Typography sx={{ color: "black", textAlign: "center", fontSize: "12px" }}>
            {formatDate(stock?.purchase_date)}
          </Typography>
        ),
        currentPrice: (
          <Typography sx={{ color: "black", textAlign: "center", fontSize: "12px" }}>
            {formatPrice(stock?.live_price)}
          </Typography>
        ),
        investment: (
          <Typography sx={{ color: "black", textAlign: "center", fontSize: "12px" }}>
            {formatPrice(totalInvestment)}
          </Typography>
        ),
        profitLoss: (
          <Typography sx={{ color: profit >= 0 ? "#4CAF50" : "#FF4040", fontSize: "12px", textAlign: "center" }}>
            {formatPrice(profit)} {formatPercent(percentGain) ? `${formatPercent(percentGain)}` : ""}
          </Typography>
        ),
        currentValue: (
          <Typography sx={{ color: "black", textAlign: "center", fontSize: "12px" }}>
            {formatPrice(totalValue)}
          </Typography>
        ),
        "": (
          <Box sx={{ width: 48, display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => deleteStock(stock)}
              sx={{
                minWidth: "auto",
                p: 1,
                color: "#FF4040",
              }}
            >
              <MdDelete size={20} />
            </Button>
          </Box>
        ),
      };
    })
    : []; // Default to an empty array if no stocks are available.

  return (
    <>
      <SoftBox py={3}>
        <SoftBox mb={1}>
          <Card sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            padding: {
              xs: '10px', // Less padding on mobile
              sm: '20px'  // Regular padding on larger screens
            },
            width: "100%", // Ensure card takes full width
            overflow: "hidden" // Prevent card overflow
          }}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <SoftTypography variant="lg" color="text.primary" fontWeight="bold" sx={{ color: '#000' }}> {/* Set color to pure black */}
                Stock List
              </SoftTypography>
            </SoftBox>
            <SoftBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[300]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[300]}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} pagination={true} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>


      {/* Render Line Chart Below the Table */}
      {selectedStock && (
        <Card
          sx={{
            backgroundColor: 'rgba(245, 245, 245, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            p: 2,
            minHeight: '500px'  // Add minimum height to ensure consistent card size
          }}
        >
          <SoftBox mb={3}>
            <SoftTypography
              variant="h4"
              color="text.primary"
              fontWeight="bold"
              sx={{ letterSpacing: 0.5 , color: '#67748e' }}
            >
              {selectedStock.symbol}
            </SoftTypography>
          </SoftBox>

          <Grid container spacing={2}>
            <Grid item xl={7.5} xs={12}>
              <SoftBox height="100%">
                <GradientLineChart selectedStock={selectedStock} />
              </SoftBox>
            </Grid>
            <Grid item xl={4.5} xs={12}>
              <SoftBox>
                <TodoCard selectedStock={selectedStock}/>
              </SoftBox>
            </Grid>
          </Grid>
        </Card>
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
    </>
  );

}

Messages.propTypes = {
  stocks: PropTypes.arrayOf(PropTypes.string).isRequired, // stocks must be an array of strings and is required
  fetchUserStocks: PropTypes.func.isRequired, // fetchUserStocks must be a function and is required
};

// Default props (optional)
Messages.defaultProps = {
  stocks: [], // Default to an empty array if no stocks are provided
};

export default Messages;
