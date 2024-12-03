import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Box } from "@mui/material";
import burceMars from "assets/images/avatar-simmmple.png";
import breakpoints from "assets/theme/base/breakpoints";
import VuiAvatar from "components/VuiAvatar";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { IoCube, IoDocument, IoBuild } from "react-icons/io5";
import { useEffect, useState, useContext } from "react";

function Header({ username, email, stocks }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [investmentMetrics, setInvestmentMetrics] = useState({
    totalInvestment: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    annualisedReturn: 0,
    dailyChange: 0
  });
  console.log("stocks2", stocks);
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

    // Annualised Return Calculation
    const annualisedReturns = stocks.map(stock => {
      const beginningValue = stock.quantity * stock.average_price;
      const endingValue = stock.quantity * stock.live_price;
      
      // Calculate years held
      const purchaseDate = new Date(stock.purchase_date);
      const currentDate = new Date();
      const yearsHeld = (currentDate - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);

      // Avoid division by zero and handle negative years
      if (yearsHeld <= 0) return 0;

      // CAGR Calculation
      return Math.pow(endingValue / beginningValue, 1 / yearsHeld) - 1;
    });

    // Average annualised return across all stocks
    const avgAnnualisedReturn = annualisedReturns.length > 0 
      ? (annualisedReturns.reduce((a, b) => a + b, 0) / annualisedReturns.length) * 100 
      : 0;

    // Daily Change (simplified calculation)
    
    const dailyChange = stocks.reduce((sum, stock) => {
      const dailyChangePercent = ((stock.live_price - stock.previous_close) / stock.previous_close) * 100;
      return sum + (dailyChangePercent * (stock.quantity * stock.live_price) / totalCurrentValue);
    }, 0);


    return {
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      annualisedReturn: avgAnnualisedReturn,
      dailyChange
    };
  };

  // Calculate metrics when stocks change
  useEffect(() => {
    const metrics = calculateInvestmentMetrics(stocks);
    setInvestmentMetrics(metrics);
  }, [stocks]);

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
    switch(tabValue) {
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
          px: 3,
          mt: 2,
          width: '100%'
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={({ breakpoints }) => ({
            gap: "16px",
            [breakpoints.up("sm")]: {
              gap: "8px",
            },
          })}
        >
          {/* Avatar and Username Section */}
          <Grid
            item
            xs={12}
            sm={4}
            md={4}
            lg={4}
            xl={4}
            xxl={3.5}
            display="flex"
            alignItems="center"
            sx={({ breakpoints }) => ({
              [breakpoints.only("sm")]: {
                justifyContent: "flex-start",
              },
            })}
          >
            <VuiAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
              sx={{ marginRight: 2 }}
            />
            <VuiBox
              height="100%"
              lineHeight={1}
              display="flex"
              flexDirection="column"
            >
              <VuiTypography variant="lg" color="white" fontWeight="bold">
                {username && username}
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular">
                {email}
              </VuiTypography>
            </VuiBox>
          </Grid>

          {/* Investment Metrics Table Section */}
          <Grid
            item
            xs={12}
            sm={8}
            md={8}
            lg={8}
            xl={8}
            xxl={8.5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: '100%'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'space-between',
              color: 'white',
              py: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1 
              }}>
                <VuiTypography variant="caption" color="text" sx={{ mb: 1 }}>
                  Total Investment
                </VuiTypography>
                <VuiTypography variant="h5" color="white">
                  {formatCurrency(investmentMetrics.totalInvestment)}
                </VuiTypography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1 
              }}>
                <VuiTypography variant="caption" color="text" sx={{ mb: 1 }}>
                  Total Current Value
                </VuiTypography>
                <VuiTypography variant="h5" color="white">
                  {formatCurrency(investmentMetrics.totalCurrentValue)}
                </VuiTypography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1 
              }}>
                <VuiTypography variant="caption" color="text" sx={{ mb: 1 }}>
                  Total Profit/Loss
                </VuiTypography>
                <VuiTypography 
                  variant="h5" 
                  color="white"
                  sx={{ 
                    color: investmentMetrics.totalProfitLoss >= 0 ? '#4CAF50' : '#FF4040' 
                  }}
                >
                  {formatCurrency(investmentMetrics.totalProfitLoss)}
                </VuiTypography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1 
              }}>
                <VuiTypography variant="caption" color="text" sx={{ mb: 1 }}>
                  Annualised Return
                </VuiTypography>
                <VuiTypography variant="h5" color="white">
                  {investmentMetrics.annualisedReturn.toFixed(2)}%
                </VuiTypography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1 
              }}>
                <VuiTypography variant="caption" color="text" sx={{ mb: 1 }}>
                  Daily Change
                </VuiTypography>
                <VuiTypography 
                  variant="h5" 
                  color="white"
                  sx={{ 
                    color: investmentMetrics.dailyChange >= 0 ? '#4CAF50' : '#FF4040' 
                  }}
                >
                  {investmentMetrics.dailyChange.toFixed(2)}%
                </VuiTypography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

export default Header;