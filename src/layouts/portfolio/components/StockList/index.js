import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { MdDelete } from "react-icons/md";
import { Box, Button, Card, Modal, Snackbar, SnackbarContent, Typography } from "@mui/material";
import { supabase } from "lib/supabase";
import { useEffect, useState } from "react";
import Table from "examples/Tables/Table";
import VuiTypography from "components/VuiTypography";
import VuiBox from "components/VuiBox";
import LineChart from "examples/Charts/LineCharts/LineChart";

const StockList = ({ stocks, fetchUserStocks }) => {
  const {
    gradients: { card },
  } = colors;

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
    { name: "companyName", align: "left"},
    { name: "quantity", align: "center" },
    { name: "purchasePrice", align: "center" },
    { name: "purchaseDate", align: "center" },
    { name: "currentPrice", align: "center" },
    { name: "investment", align: "center" },
    { name: "profitLoss", align: "center" },
    { name: "currentValue", align: "center" },
    { name: "action", align: "center" },
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
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "13px",
                  fontWeight: 400,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => handleStockClick(stock)}
              >
              {getDisplayName(stock)}
            </Typography>
          ),
          quantity: (
            <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "12px" }}>
              {stock?.quantity}
            </Typography>
          ),
          purchasePrice: (
            <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "12px" }}>
              {formatPrice(stock?.average_price)}
            </Typography>
          ),
          purchaseDate: (
            <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "12px" }}>
              {formatDate(stock?.purchase_date)}
            </Typography>
          ),
          currentPrice: (
            <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "12px" }}>
              {formatPrice(stock?.live_price)}
            </Typography>
          ),
          investment: (
            <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "12px" }}>
              {formatPrice(totalInvestment)}
            </Typography>
          ),
          profitLoss: (
            <Typography sx={{ color: profit >= 0 ? "#4CAF50" : "#FF4040", fontSize: "12px", textAlign: "center" }}>
              {formatPrice(profit)} {formatPercent(percentGain) ? `${formatPercent(percentGain)}` : ""}
            </Typography>
          ),
          currentValue: (
            <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "12px" }}>
              {formatPrice(totalValue)}
            </Typography>
          ),
          action: (
            <Box sx={{ width: 48, display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => deleteStock(stock)}
                sx={{
                  minWidth: "auto",
                  p: 1,
                  color: "#FF4040",
                  // "&:hover": {
                  //   backgroundColor: "rgba(255, 255, 255, 0.1)",
                  // },
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
      <VuiBox py={3}>
        <VuiBox mb={1}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Stock List
              </VuiTypography>
            </VuiBox>
            <VuiBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
              >
              <Table columns={columns} rows={rows} pagination={true} />
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>

      {/* Render Line Chart Below the Table */}
      {selectedStock && (
        <VuiBox mt={2}>
          <Card>
            <VuiBox p={3}>
              <VuiTypography variant="lg" color="white" mb={2}>
                {`${selectedStock.symbol}`}
              </VuiTypography>
              <LineChart selectedStock={selectedStock} />
            </VuiBox>
          </Card>
        </VuiBox>
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
  
  // Export the columns and rows
  // return (
  //   <Box
  //     sx={{
  //       background: linearGradient(card.main, card.state, card.deg),
  //       borderRadius: "15px",
  //       p: 3,
  //       width: "100%",
  //     }}
  //   >
  //     <Typography
  //       variant="h6"
  //       sx={{
  //         color: "#fff",
  //         fontSize: "1.25rem",
  //         mb: 4,
  //         fontWeight: 400,
  //       }}
  //     >
  //       Stock Lists
  //     </Typography>

  //     {/* Headers */}
  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         backgroundColor: "rgba(255, 255, 255, 0.1)",
  //         borderRadius: "10px",
  //         p: 2,
  //         mb: 2,
  //       }}
  //     >
  //       <Typography
  //         sx={{ color: "#fff", flex: 2, fontSize: "17px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         Company Name
  //       </Typography>
  //       <Typography
  //         sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         Quantity
  //       </Typography>
  //       <Typography
  //         sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         Bought Price
  //       </Typography>
  //       <Typography
  //         sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         Current Price
  //       </Typography>
  //       <Typography
  //         sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         Investment
  //       </Typography>
  //       <Typography
  //         sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         P/L
  //       </Typography>
  //       <Typography
  //         sx={{ color: "#fff", flex: 1, fontSize: "16px", fontWeight: 600, textAlign: "center" }}
  //       >
  //         Current Value
  //       </Typography>
  //       <Box sx={{ width: 48 }} />
  //     </Box>

  //     {stocks.length > 0 ? (
  //       stocks.map((stock) => {
  //         const profit = calculateProfit(stock?.quantity, stock?.live_price, stock?.average_price);
  //         const percentGain = calculatePercentGain(stock?.live_price, stock?.average_price);
  //         const totalValue = calculateTotalValue(stock?.quantity, stock?.live_price);
  //         const totalInvestment = calculateTotalInvestment(stock?.quantity, stock?.average_price);

  //         return (
  //           <Box
  //             key={stock.portfolio_id}
  //             sx={{
  //               display: "flex",
  //               alignItems: "center",
  //               backgroundColor: "rgba(255, 255, 255, 0.05)",
  //               borderRadius: "10px",
  //               p: 2,
  //               mb: 2,
  //               fontSize: "13px",
  //               "&:hover": {
  //                 backgroundColor: "rgba(255, 255, 255, 0.1)",
  //               },
  //             }}
  //           >
  //             <Typography
  //               sx={{
  //                 color: "#fff",
  //                 textAlign: "center",
  //                 flex: 2,
  //                 fontSize: "17px",
  //                 fontWeight: 400,
  //               }}
  //             >
  //               {getDisplayName(stock)}
  //             </Typography>
  //             <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
  //               {stock?.quantity}
  //             </Typography>
  //             <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
  //               {formatPrice(stock?.average_price)}
  //             </Typography>
  //             <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
  //               {/* {formatPrice(stock?.live_price) ? formatPrice(stock?.live_price) : "-"} */}
  //               {formatPrice(stock?.live_price)}
  //             </Typography>
  //             <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
  //               {formatPrice(totalInvestment)}
  //             </Typography>
  //             <Typography
  //               sx={{
  //                 color: profit >= 0 ? "#4CAF50" : "#FF4040",
  //                 flex: 1,
  //                 fontSize: "13px",
  //                 textAlign: "center",
  //               }}
  //             >
  //               {/* {formatPrice(profit)} ({percentGain >= 0 ? "+" : ""}
  //               {isNaN(percentGain) ? "-%)" : `${percentGain.toFixed(2)}%`} */}
  //               {formatPrice(profit)}{" "}
  //               {formatPercent(percentGain) ? `${formatPercent(percentGain)}` : ""}
  //             </Typography>
  //             <Typography sx={{ color: "#fff", textAlign: "center", flex: 1, fontSize: "13px" }}>
  //               {formatPrice(totalValue)}
  //             </Typography>
  //             <Box sx={{ width: 48, display: "flex", justifyContent: "center" }}>
  //               <Button
  //                 onClick={() => deleteStock(stock)}
  //                 sx={{
  //                   minWidth: "auto",
  //                   p: 1,
  //                   color: "#FF4040",
  //                   "&:hover": {
  //                     backgroundColor: "rgba(255, 255, 255, 0.1)",
  //                   },
  //                 }}
  //               >
  //                 <MdDelete size={20} />
  //               </Button>
  //             </Box>
  //           </Box>
  //         );
  //       })
  //     ) : (
  //       <Box
  //         sx={{
  //           backgroundColor: "rgba(255, 255, 255, 0.05)",
  //           borderRadius: "10px",
  //           p: 3,
  //           textAlign: "center",
  //           color: "#fff",
  //         }}
  //       >
  //         No Stocks is added
  //       </Box>
  //     )}

  //     <Snackbar
  //       open={snackbarOpen}
  //       autoHideDuration={3000}
  //       onClose={handleSnackbarClose}
  //       anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //     >
  //       <SnackbarContent
  //         message={snackbarMessage}
  //         onClose={handleSnackbarClose}
  //         sx={{ backgroundColor: "red" }}
  //       />
  //     </Snackbar>
  //   </Box>
  // );
};

export default StockList;

