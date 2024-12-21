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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Box } from "@mui/material";
import burceMars from "assets/images/image.png";
import breakpoints from "assets/theme/base/breakpoints";
// import SoftAvatar from "components/SoftAvatar";
// import SoftBox from "components/SoftBox";
// import SoftTypography from "components/SoftTypography";
import { IoCube, IoDocument, IoBuild } from "react-icons/io5";
import { useEffect, useState, useContext } from "react";
import axios from "axios";


// RiskCompass AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import PropTypes from "prop-types";

function Emails({ username, email, stocks }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [investmentMetrics, setInvestmentMetrics] = useState({
    totalInvestment: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    annualisedReturn: 0,
    dailyChange: 0
  });


  const [mergedStocks, setMergedStocks] = useState([]);

  useEffect(() => {
    if (stocks.length > 0) {
      const userId = stocks[0]?.users?.user_id;
      console.log("userId:", userId);

      if (userId) {
        const fetchPreviousCloseData = async () => {
          try {
            const response = await axios.get(
              `https://rcapidev.neosme.co:2053/user-portfolio/${userId}`
            );

            const previousCloseData = response.data;

            const updatedStocks = stocks.map(stock => {
              const matchingPreviousClose = previousCloseData.find(
                prev => prev.portfolio_id === stock.portfolio_id
              );

              return {
                ...stock,
                previous_close: matchingPreviousClose
                  ? matchingPreviousClose.previous_close
                  : null,
              };
            });
            console.log('updatedStocks', updatedStocks);
            setMergedStocks(updatedStocks);
          } catch (error) {
            console.error("Error fetching previous close data:", error);
          }
        };

        fetchPreviousCloseData();
      }
    }
  }, [stocks]); // Only runs when `stocks` changes


  // Utility function to calculate investment metrics
  const calculateInvestmentMetrics = (stocks) => {
    if (!stocks || stocks.length === 0) return {
      totalInvestment: 0,
      totalCurrentValue: 0,
      totalProfitLoss: 0,
      annualisedReturn: 0,
      dailyChange: 0
    };

    // Total Investment
    const totalInvestment = stocks.reduce((sum, stock) =>
      sum + (stock.quantity * stock.average_price), 0);

    // Total Current Value
    const totalCurrentValue = stocks.reduce((sum, stock) =>
      sum + (stock.quantity * stock.live_price), 0);

    // Total Profit/Loss
    const totalProfitLoss = totalCurrentValue - totalInvestment;

    const calculateAnnualizedReturn = (purchasePrice, quantity, purchaseDate, livePrice) => {
      const currentDate = new Date();
      const purchaseDateObj = new Date(purchaseDate);

      if (purchaseDateObj > currentDate) {
        return 0;
      }

      const yearsHeld = (currentDate - purchaseDateObj) / (1000 * 60 * 60 * 24 * 365);

      if (yearsHeld <= 0) {
        return 0;
      }

      const beginningValue = purchasePrice * quantity;
      const endingValue = parseFloat(livePrice) * quantity; // Parse livePrice as float

      if (beginningValue === 0 || endingValue === 0) {
        return 0;
      }

      const annualizedReturn = Math.pow(endingValue / beginningValue, 1 / yearsHeld) - 1;
      return annualizedReturn;
    };

    const annualizedReturns = stocks.map(stock => {
      const annualizedReturn = calculateAnnualizedReturn(
        stock.average_price,
        stock.quantity,
        stock.purchase_date,
        stock.live_price
      );

      const stockValue = stock.quantity * parseFloat(stock.live_price);

      return {
        symbol: stock.symbol,
        annualizedReturn: annualizedReturn,
        stockValue: stockValue
      };
    });

    const totalPortfolioValue = annualizedReturns.reduce((total, stock) => total + stock.stockValue, 0);

    const weightedAnnualizedReturn = annualizedReturns.reduce((total, stock) => {
      return total + (stock.annualizedReturn * stock.stockValue);
    }, 0) / totalPortfolioValue;

    const overallAnnualizedReturn = (weightedAnnualizedReturn * 100).toFixed(2);

    console.log('annualisedReturn', overallAnnualizedReturn);

    // Daily Change (simplified calculation)
    const dailyChange = mergedStocks.reduce((sum, stock) => {
      const dailyChangePercent = ((stock.live_price - stock.previous_close) / stock.previous_close) * 100;
      // Weight of the stock in the portfolio
      const stockValue = stock.quantity * stock.live_price;
      const weight = stockValue / totalCurrentValue;
      // Add the weighted daily change percentage to the sum
      return sum + (dailyChangePercent * weight);
    }, 0);

    console.log('dailychange',mergedStocks);

    return {
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      annualisedReturn: overallAnnualizedReturn,
      dailyChange
    };
  };

  // Calculate metrics when stocks change
  useEffect(() => {
    const metrics = calculateInvestmentMetrics(stocks);
    setInvestmentMetrics(metrics);
  }, [stocks, mergedStocks]);

  // Handle tab orientation
  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.lg
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Render tab content based on selected tab
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Total Investment
        return formatCurrency(investmentMetrics.totalInvestment);
      case 1: // Total Current Value
        return formatCurrency(investmentMetrics.totalCurrentValue);
      case 2: // Total Profit/Loss
        return (
          <span style={{ color: investmentMetrics.totalProfitLoss >= 0 ? '#4CAF50' : '#FF4040' }}>
            {formatCurrency(investmentMetrics.totalProfitLoss)}
          </span>
        );
      case 3: // Annualised Return
        return `${investmentMetrics.annualisedReturn.toFixed(2)}%`;
      case 4: // Daily Change
        return (
          <span style={{ color: investmentMetrics.dailyChange >= 0 ? '#4CAF50' : '#FF4040' }}>
            {investmentMetrics.dailyChange.toFixed(2)}%
          </span>
        );
      default:
        return '';
    }
  };

  return (
    <Box position="relative">
      <Card
        sx={{
          px: 4,
          py: 3,
          mt: 2,
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)'
        }}
      >
        {/* Top Section - Avatar, Username, Email */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3 // Add margin bottom to separate from metrics
          }}
        >
          <SoftAvatar
            src={burceMars}
            alt="profile-image"
            variant="rounded"
            size="xl"
            shadow="sm"
          />
          <Box
            display="flex"
            flexDirection="column"
            gap={0.5}
          >
            <SoftTypography 
              variant="h6" 
              color="dark" 
              fontWeight="bold"
              sx={{ fontSize: '1.1rem' }}
            >
              {username}
            </SoftTypography>
            <SoftTypography 
              variant="button" 
              color="text"
              sx={{ 
                fontSize: '0.875rem',
                opacity: 0.8
              }}
            >
              {email}
            </SoftTypography>
          </Box>
        </Box>
  
        {/* Metrics Section */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            gap: 3
          }}
        >
          {/* Metric Boxes */}
          {[
            {
              label: 'Total Investment',
              value: formatCurrency(investmentMetrics.totalInvestment),
              color: 'dark'
            },
            {
              label: 'Total Current Value',
              value: formatCurrency(investmentMetrics.totalCurrentValue),
              color: 'dark'
            },
            {
              label: 'Total Profit/Loss',
              value: formatCurrency(investmentMetrics.totalProfitLoss),
              color: investmentMetrics.totalProfitLoss >= 0 ? '#4CAF50' : '#FF4040'
            },
            {
              label: 'Annualised Return',
              value: `${investmentMetrics.annualisedReturn}%`,
              color: 'dark'
            },
            {
              label: 'Daily Change',
              value: `${investmentMetrics.dailyChange.toFixed(2)}%`,
              color: investmentMetrics.dailyChange >= 0 ? '#4CAF50' : '#FF4040'
            }
          ].map((metric, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                minWidth: { xs: '45%', md: 'auto' },
                p: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(0,0,0,0.02)'
              }}
            >
              <SoftTypography 
                variant="caption" 
                color="dark" 
                fontWeight="bold"
                sx={{ 
                  mb: 1,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                {metric.label}
              </SoftTypography>
              <SoftTypography
                variant="h5"
                sx={{
                  color: metric.color,
                  fontSize: '1.25rem',
                  fontWeight: 500
                }}
              >
                {metric.value}
              </SoftTypography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

Emails.propTypes = {
  username: PropTypes.string.isRequired, // username must be a string and is required
  email: PropTypes.string.isRequired, // email must be a string and is required
  stocks: PropTypes.arrayOf(PropTypes.string).isRequired, // stocks must be an array of strings and is required
};

// Default props (optional)
Emails.defaultProps = {
  stocks: [], // default value for stocks if not provided
};

export default Emails;
