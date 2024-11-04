/*!

=========================================================
* Risk Protect AI React - v1.0.0
=========================================================

* Product Page: https://www.riskprotec.ai/product/riskprotect-ai
* Copyright 2021 RiskProtec AI (https://www.riskprotec.ai/)
* Licensed under MIT (https://github.com/riskprotectai/riskprotect-ai/blob/master LICENSE.md)

* Design and Coded by Simmmple & RiskProtec AI

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack } from "@mui/material";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// UI Risk LENS AI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// UI Risk LENS AI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe, IoStatsChart } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaCaretDown, FaCaretUp, FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/Authcontext";
import { supabase } from "lib/supabase";


function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const stockData  = useContext(AuthContext)
  const [stocks, setStocks] = useState([]);
  const [stocksPercent,setStocksPercent] = useState([]);

  const initialStockData = {
    symbol: "TCS",
    company_name: "Tata Consultancy Services Limited",
    country: "India",
    price: "4084.64990",
    open: "4075.00000",
    high: "4107.00000",
    low: "4060.05005",
    percent_change: "0.23066",
    currency: "INR",
    exchange: "NSE",
    change: "9.39990",
    previous_close: "4075.25000",
    volume: "1934976",
    close: "4084.64990",
    type : 'Common Stock',
    is_market_open: false,
    trading_date: "N/A",
    last_updated: "2024-10-30T14:37:05.098775"
  };

  const [stocksData,setStocksData] = useState(stockData?.stockData || initialStockData)

  
  useEffect(() => {
    if (!stockData?.stockData || stockData.stockData.length === 0) {
      setStocksData(initialStockData);
    } else {
      setStocksData(stockData.stockData);
    }
  }, [stockData]);
  
  console.log('Dashboard',stocksData);

    
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  console.log(today);

  const fetchStockData = async () => {
    try {
      const { data, error } = await supabase.from("price").select("*");

      if (error) throw error;
      if (data) setStocks(data);
    } catch (error) {
      console.log("Error fetching stocks:", error);
    }
  };

  const fetchDailyStock = async () => {
    try {
      const { data, error } = await supabase
      .from('stock_daily_summary')
      .select('*')
      .eq('trading_date',today);


      if (error) throw error;
      if (data) setStocksPercent(data);
    } catch (error) {
      console.log("Error fetching stocks:", error);
    }
  };


  console.log('price', stocks);
  console.log('pricePercent', stocksPercent);

  const updated_price = stocks.filter(
    (ele) => ele.symbol === stocksData.symbol && ele.exchange === stocksData.exchange
  );

  const price_percent = stocksPercent.filter(
    (ele) =>
      ele.symbol === stocksData.symbol &&
      ele.exchange === stocksData.exchange &&
      ele.trading_date === today
  );

  const New_price = updated_price[updated_price.length - 1];
  console.log("New_price", New_price);

  const isPositiveChange = price_percent[0]?.percentage_change > 0;

  const icon = isPositiveChange ? (
    <FaCaretUp style={{ color: "green" }} />
  ) : (
    <FaCaretDown style={{ color: "red" }} />
  );

  const percentageColor = isPositiveChange ? "success" : "error";

  useEffect(() => {
    fetchStockData();
    fetchDailyStock();


    console.log("Stocks component rendered");

    const channel_1 = supabase
      .channel("price-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "price" }, (payload) => {
        // console.log('Real-time update:', payload);

        setStocks((prevStocks) => {
          const { eventType, new: newStock, old: oldStock } = payload;

          switch (eventType) {
            case "INSERT":
              return [...prevStocks, newStock];
            case "UPDATE":
              return prevStocks.map((stock) => (stock.id === newStock.id ? newStock : stock));
            case "DELETE":
              return prevStocks.filter((stock) => stock.id !== oldStock.id);
            default:
              return prevStocks;
          }
        });
      })
      .subscribe((status) => console.log("Subscription status:", status));

    const channel_2 = supabase
      .channel("stock_daily_summary-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stock_daily_summary" },
        (payload) => {
          console.log("stock_daily_summary:", payload);

          setStocksPercent((prevStocks) => {
            const { eventType, new: newStock, old: oldStock } = payload;

            switch (eventType) {
              case "INSERT":
                return [...prevStocks, newStock];
              case "UPDATE":
                return prevStocks.map((stock) => (stock.id === newStock.id ? newStock : stock));
              case "DELETE":
                return prevStocks.filter((stock) => stock.id !== oldStock.id);
              default:
                return prevStocks;
            }
          });
        }
      )
      .subscribe((status) => console.log("Subscription status:", status));

    return () => {
      supabase.removeChannel(channel_1);
      supabase.removeChannel(channel_2);
    };
  }, []);

  const getIcon = (title) => {
    switch (title) {
      case "Currency & Exchange":
        return <FaMoneyBillWave size="22px" color="white" />;
      case "MIC Code & Country":
        return <IoGlobe size="22px" color="white" />;
      case "Type of Stock":
        return <IoStatsChart size="22px" color="white" />;
      default:
        return <IoWallet size="22px" color="white" />;
    }
  };

  return (
    <DashboardLayout>
      {/* <DashboardNavbar handleClickStock={handleClickStock} /> */}
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6} lg={3}>
              <MiniStatisticsCard
                title={{
                  text: stocksData?.company_name,
                  fontWeight: "regular",
                  sx: { fontSize: "1.5rem" },
                }}
                count={
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {New_price?.price?.toFixed(2)}
                  </span> 
                }
                percentage={{
                  color: percentageColor,
                  text: (
                    <>
                      {icon}
                      {`${
                        price_percent[0]?.price_change.toFixed(2) === undefined
                          ? ""
                          : price_percent[0]?.price_change.toFixed(2)
                      } 
                    (${
                      price_percent[0]?.percentage_change === undefined
                        ? ""
                        : price_percent[0]?.percentage_change
                    }%)`}
                    </>
                  ),
                }}
                icon={{ color: "info", component: getIcon(stocksData?.company_name) }}
                sx={{ width: "100%", height: "100%" }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Currency & Exchange", sx: { fontSize: "1.5rem" } }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {`${stocksData?.currency} / ${stocksData?.exchange}`}
                  </span>
                }
                icon={{ color: "info", component: getIcon("Currency & Exchange") }}
                sx={{ width: "100%", height: "100%" }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Symbol & Country", sx: { fontSize: "1.5rem" } }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {`${stocksData?.symbol}, ${stocksData?.country}`}
                  </span>
                }
                icon={{ color: "info", component: getIcon("MIC Code & Country") }}
                sx={{ width: "100%", height: "100%" }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <MiniStatisticsCard
                title={{ text: "Type of Stock", sx: { fontSize: "1.5rem" } }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{stocksData?.type}</span>
                }
                icon={{ color: "info", component: getIcon("Type of Stock") }}
                sx={{ width: "100%", height: "100%" }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={12} xl={5}>
              <WelcomeMark stocksData={stocksData} />
            </Grid>
            <Grid item xs={12} lg={6} xl={3}>
              <SatisfactionRate />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={7}>
              <Card>
                <VuiBox sx={{ height: "100%" }}>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Sales Overview
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    <VuiTypography variant="button" color="success" fontWeight="bold">
                      +5% more{" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox sx={{ height: "310px" }}>
                    <LineChart
                      lineChartData={lineChartDataDashboard}
                      lineChartOptions={lineChartOptionsDashboard}
                    />
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} xl={5}>
              <Card>
                <VuiBox>
                  <VuiBox
                    mb="24px"
                    height="220px"
                    sx={{
                      background: linearGradient(
                        cardContent.main,
                        cardContent.state,
                        cardContent.deg
                      ),
                      borderRadius: "20px",
                    }}
                  >
                    <BarChart
                      barChartData={barChartDataDashboard}
                      barChartOptions={barChartOptionsDashboard}
                    />
                  </VuiBox>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Active Users
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    <VuiTypography variant="button" color="success" fontWeight="bold">
                      (+23){" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        than last week
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <Grid container spacing="50px">
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoWallet color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Users
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        32,984
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoIosRocket color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Clicks
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        2,42M
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <FaShoppingCart color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Sales
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        2,400$
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoBuild color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Items
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        320
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                  </Grid>
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
