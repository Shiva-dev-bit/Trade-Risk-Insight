
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
import { Card, LinearProgress, Stack, Typography } from "@mui/material";

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

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "context/Authcontext";
import { supabase } from "lib/supabase";
import axios from "axios";
import CompanyDescription from "./components/CompanySummary";
import moment from "moment-timezone";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const stockData = useContext(AuthContext);
  // const [stocks, setStocks] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);


  const [supabaseStocks, setSupabaseStocks] = useState([]);
  const [websocketStocks, setWebsocketStocks] = useState([]);
  const [stocksPercent, setStocksPercent] = useState([]);
  const [symbols_data, setSymbols_data] = useState([])

  console.log('websocketStocks', websocketStocks);

  const initialStockData = {
    "symbol": "NSEI",
    "company_name": "NIFTY 50",
    "country": "India",
    "price": "24620.50000",
    "type": null,
    "open": "24645.00000",
    "high": "24677.75000",
    "low": "24511.84961",
    "percent_change": "0.00609",
    "currency": "INR",
    "exchange": "NSE",
    "change": "1.50000",
    "previous_close": "24619.00000",
    "volume": "260940306",
    "close": "24620.50000",
    "is_market_open": false,
    "trading_date": "N/A",
    "last_updated": "2024-12-10T10:25:18.239145"
  };

  const [stocksData, setStocksData] = useState(stockData?.stockData || initialStockData)
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  console.log('stocksData', stocksData);

  const [StatisticsData, setStatisticsData] = useState({
    statistics: {
      valuations_metrics: {
        forward_pe: 26.9,
        price_to_sales_ttm: 7.3,
        enterprise_to_ebitda: 23.6,
      },
      dividends_and_splits: {
        forward_annual_dividend_yield: 0.05,
      },
    }
  });

  const [indicators, setIndicators] = useState({
      "symbol": "NSEI",
      "exchange": "NSE",
      "current_price": 24620.5,
      "signals": {
          "macd": {
              "datetime": "2024-12-10",
              "macd": 79.40186,
              "macd_signal": -29.96754,
              "signal": "BUY"
          },
          "vwap": {
              "datetime": "2024-12-10",
              "vwap": 24603.36654,
              "current_price": 24620.5,
              "signal": "SELL"
          },
          "rsi": {
              "datetime": "2024-12-10",
              "rsi": 57.86982,
              "signal": "SELL"
          },
          "sma": {
              "datetime": "2024-12-10",
              "sma": 24095.44268,
              "current_price": 24620.5,
              "signal": "BUY"
          }
      }
  }
  )

  console.log('indicators', indicators);

  const [chartConfig, setChartConfig] = useState({
    barChartData: [],
    barColors: [],
    barChartOptions: {}
  });


  useEffect(() => {
    if (!indicators) return;

    let barChartData = [{
      name: indicators?.symbol,
      data: [
        100, // Fixed height for MACD
        100, // Fixed height for VWAP
        100, // Fixed height for RSI
        100  // Fixed height for SMA
      ]
    }];

    let barColors = [
      indicators?.signals?.macd?.signal === "SELL" ? '#ef4444' : '#22c55e',
      indicators?.signals?.vwap?.signal === "SELL" ? '#ef4444' : '#22c55e',
      indicators?.signals?.rsi?.signal === "SELL" ? '#ef4444' : '#22c55e',
      indicators?.signals?.sma?.signal === "SELL" ? '#ef4444' : '#22c55e',
    ];

    let barChartOptions = {
      chart: {
        toolbar: {
          show: false,
        },
        background: 'transparent'
      },
      tooltip: {
        style: {
          fontSize: "10px",
          fontFamily: "Plus Jakarta Display",
        },
        theme: "dark",
        y: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            const values = [
              indicators?.signals.signals.macd.macd,
              indicators?.signals.signals.vwap.vwap,
              indicators?.signals.signals.rsi.rsi,
              indicators?.signals.signals.sma.sma
            ];
            return values[dataPointIndex]?.toFixed(2);
          }
        }
      },
      xaxis: {
        categories: ["MACD", "VWAP", "RSI", "SMA"],
        labels: {
          style: {
            colors: "#fff",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        show: false,
        labels: {
          style: {
            colors: "#fff",
            fontSize: "12px",
          },
        },
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "30px",
          distributed: true,
        },
      },
      colors: barColors,
      title: {
        text: `Technical Indicators : ${indicators?.symbol}`,
        style: {
          color: "#fff",
          fontSize: "16px",
        },
      }
    };

    setChartConfig({
      barChartData,
      barColors,
      barChartOptions
    });
  }, [indicators]);

  const fetchStatistics = async () => {
    try {
      const response = await axios(`https://rcapidev.neosme.co:2053/statistics/${stockData?.stockData?.symbol}`);
      const data = response.data;

      if (data) {
        console.log('staticsticsdata', data);
        setStatisticsData(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.log('Error fetching statistics:', error);
    }
  }

  const fetchIndicators = async () => {
    try {
      const response = await axios(`https://rcapidev.neosme.co:2053/technical-analysis/${stocksData?.symbol}/${stocksData?.exchange}`);
      const data = response.data;
      if (data) {
        console.log('indicators', data);
        setIndicators(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.log('Error fetching statistics:', error);
    }
  }


  useEffect(() => {
    if (!stockData?.stockData || stockData.stockData.length === 0) {
      setStocksData(initialStockData);
    } else {
      fetchStatistics();
      fetchIndicators();
      setStocksData(stockData.stockData);
    }
  }, [stockData, stocksData?.symbol, stocksData?.exchange]);


  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  const fetchStockData = async () => {

    try {
      const { data, error } = await supabase.from("price")
        .select("*")
        .eq("symbol", `${stockData?.stockData?.symbol}`)
        .eq("exchange", `${stockData?.stockData?.exchange}`)
        .order("trading_date", { ascending: false }) // Sort by 'trading_date' in descending order
        .limit(1);
      // .eq("trading_date",today)

      if (data) {
        setSupabaseStocks(data);
      }
      if (error) throw error;
    } catch (error) {
      console.log("Error fetching stocks:", error);
    }
  };

  const fetchDailyStock = async () => {
    console.log('Today', today);

    try {
      const { data, error } = await supabase
        .from("stock_daily_summary")
        .select("*")
        .eq("symbol", `${stockData?.stockData?.symbol}`)
        .eq("exchange", `${stockData?.stockData?.exchange}`)
        .order("trading_date", { ascending: false }) // Sort by 'trading_date' in descending order
        .limit(1);

      if (error) throw error;
      if (data) setStocksPercent(data);
    } catch (error) {
      console.log("Error fetching stocks:", error);
    }
  };
  

  const fetchStockSymbols = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("stocks")
        .select("symbol, exchange")
        .eq("symbol", stockData.stockData.symbol)
        .eq("exchange", stockData.stockData.exchange)
        .single(); // Use .single() if you expect only one result

      if (error) {
        setSymbols_data([]);
        return;
      }
      if (data) {
        setSymbols_data([data]); // Wrap in an array to maintain consistency
      } else {
        setSymbols_data([]); // Ensure empty array if no data
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setSymbols_data([]);
    }
  }, [stockData?.stockData?.symbol, stockData?.stockData?.exchange]);
  
  useEffect(() => {
    // Call fetchStockSymbols directly in the useEffect
    fetchStockSymbols();
  }, [fetchStockSymbols]); // Add fetchStockSymbols to dependency array

  const [priceData, setPriceData] = useState({
    New_price: 0.0000,
    price_change: 0.0000,
    percent_change: 0.0000,
    isPositiveChange: null,
    icon: null,
    percentageColor: "",
    open: 0.00,
    low: 0.00,
    high: 0.00,
    close: 0.00,
    datetime: null
  });

  console.log('pricedata',priceData);

  useEffect(() => {
    // Reset price data when stock changes
    setPriceData({
      New_price: 0.0000,
      price_change: 0.0000,
      percent_change: 0.0000,
      isPositiveChange: null,
      icon: null,
      percentageColor: "",
      open: 0.00,
      low: 0.00,
      high: 0.00,
      close: 0.00,
      datetime: null
    });
  }, [stockData?.stockData?.symbol, stockData?.stockData?.exchange]);

  function formatToDateTime(isoString) {
    return isoString.replace("T", " ").split("+")[0].split(".")[0];
  }

  useEffect(() => {
    if (!stockData?.stockData?.symbol || !stockData?.stockData?.exchange) return;
    // Determine data source and update price

    if (websocketStocks?.symbol === stockData?.stockData?.symbol &&
      websocketStocks?.exchange === stockData?.stockData?.exchange
    ) {

      const isPositiveChange = websocketStocks?.percent_change > 0;
      setPriceData({
        New_price: websocketStocks?.price,
        price_change: websocketStocks?.change,
        percent_change: websocketStocks?.percent_change,
        isPositiveChange,
        icon: isPositiveChange ? (
          <FaCaretUp style={{ color: "green" }} />
        ) : (
          <FaCaretDown style={{ color: "red" }} />
        ),
        percentageColor: isPositiveChange ? "success" : "error",
        open: websocketStocks?.open,
        low: websocketStocks?.low,
        high: websocketStocks?.high,
        close: websocketStocks?.price,
        datetime: websocketStocks?.datetime
      });
    } else if (supabaseStocks.length > 0) {
      console.log('supabaseStocks',supabaseStocks);
      const New_price = supabaseStocks[0]?.price;
      const previous_close = stocksData?.previous_close;

      if (New_price && previous_close) {
        const price_change = New_price - previous_close;
        const percent_change = (price_change / previous_close) * 100;
        const isPositiveChange = percent_change > 0;

        setPriceData({
          New_price,
          price_change,
          percent_change,
          isPositiveChange,
          icon: isPositiveChange ? (
            <FaCaretUp style={{ color: "green" }} />
          ) : (
            <FaCaretDown style={{ color: "red" }} />
          ),
          percentageColor: isPositiveChange ? "success" : "error",
          open: stocksData?.open_price,
          low: stocksData?.low_price,
          high: stocksData?.high_price,
          close: New_price,
          datetime: formatToDateTime(stocksData?.last_updated)
        });
      }
    }
  }, [supabaseStocks, websocketStocks, stocksData, stockData?.stockData?.symbol]);


  const connectWebSocket = async () => {
    try {
      // First, close existing connection properly
      if (wsRef.current) {
        if (wsRef.current.connection_id) {
          try {
            await fetch(`close-connection/${wsRef.current.connection_id}`, {
              method: 'POST'
            });
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
        wsRef.current.close();
        setIsConnected(false);
      }

      // Clear previous data when changing symbols
      setWebsocketStocks(null);

      // Validate inputs
      if (!stockData?.stockData?.symbol || !stockData?.stockData?.exchange) {
        setError('Invalid symbol or exchange');
        return;
      }

      const ws = new WebSocket(`wss://rcapidev.neosme.co:2053/ws/${stockData?.stockData?.symbol}/${stockData?.stockData?.exchange}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log(`Connected to ${stockData?.stockData?.symbol} ${stockData?.stockData?.exchange}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("event data", data);

          // Validate that the data matches the current symbol
          if (data.type === 'realtime' &&
            data.data &&
            data.data.symbol === stockData?.stockData?.symbol &&
            data.data.exchange === stockData?.stockData?.exchange) {

            setWebsocketStocks(data.data);

            if (data.connection_id) {
              wsRef.current.connection_id = data.connection_id;
            }
          }
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };

      ws.onerror = (error) => {
        setError('WebSocket error occurred');
        setIsConnected(false);
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setWebsocketStocks(null); // Clear data on disconnect
        console.log(`Disconnected from ${stockData?.stockData?.symbol} ${stockData?.stockData?.exchange}`);
      };

    } catch (err) {
      setError('Failed to connect to WebSocket');
      console.error('Connection error:', err);
    }
  };


  useEffect(() => {

    if (!stockData?.stockData?.symbol || !stockData?.stockData?.exchange) return;

    // Clear previous data when changing stocks
    setWebsocketStocks(null);
    setSupabaseStocks([]);

    if (symbols_data.length) {
      // For Indian stocks
      fetchStockData();
      fetchDailyStock();

      const channel_1 = supabase
        .channel("price-channel")
        .on("postgres_changes", { event: "*", schema: "public", table: "price" }, (payload) => {
          const { eventType, new: newStock } = payload;

          if (newStock.symbol === stockData?.stockData?.symbol) {
            setSupabaseStocks(() => {
              switch (eventType) {
                case "INSERT":
                case "UPDATE":
                  console.log("Realtime Update", newStock);
                  return [newStock];
                case "DELETE":
                  return [];
                default:
                  return [];
              }
            });
          }
        })
        .subscribe();

      const channel_2 = supabase
        .channel("stock_daily_summary-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "stock_daily_summary" },
          (payload) => {
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
        .subscribe();

      return () => {
        supabase.removeChannel(channel_1);
        supabase.removeChannel(channel_2);
      };
    } else {
      // For foreign stocks
      connectWebSocket();
    }

    return () => {
      if (wsRef.current?.connection_id) {
        fetch(`close-connection/${wsRef.current.connection_id}`, {
          method: 'POST'
        }).catch(console.error);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stockData?.stockData?.symbol, stockData?.stockData?.exchange,symbols_data]);


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
      <VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={1} alignItems="stretch">
            {/* First card with extra width */}
            <Grid item xs={12} md={6} lg={3.6}>
              <MiniStatisticsCard
                title={{
                  text: stocksData?.company_name,
                  fontWeight: "regular",
                  sx: { fontSize: "1.5rem" },
                }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {priceData?.New_price?.toFixed(2)}
                  </span>
                }
                percentage={{
                  color: priceData?.percentageColor,
                  text: (
                    <>
                      {priceData?.icon}
                      {`${priceData?.price_change?.toFixed(2)} 
                      (${(priceData?.percent_change)?.toFixed(2)}%)`}
                 <span style={{ fontSize: "0.6rem", fontWeight: 500, color: "gray", display: "block" }}>
                  {`As on ${moment(stocksData?.last_updated).format("DD MMM, YYYY | HH:mm")}`}
                </span>
                    </>
                  ),
                }}
                icon={{ color: "info", component: getIcon(stocksData?.company_name) }}
                sx={{ width: "100%", height: "100%", minHeight: "120px" }}
              />
            </Grid>

            {/* Next three cards with equal width */}
            <Grid item xs={12} md={6} lg={2.4}>
              <MiniStatisticsCard
                title={{ text: "Currency & Exchange", sx: { fontSize: "1.5rem" } }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {`${stocksData?.currency} / ${stocksData?.exchange}`}
                  </span>
                }
                icon={{ color: "info", component: getIcon("Currency & Exchange") }}
                sx={{ width: "100%", height: "100%", minHeight: "120px" }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3.6}>
              <MiniStatisticsCard
                title={{ text: "Symbol & Country", sx: { fontSize: "1.5rem" } }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {`${stocksData?.symbol}, ${stocksData?.country}`}
                  </span>
                }
                icon={{ color: "info", component: getIcon("MIC Code & Country") }}
                sx={{ width: "100%", height: "100%", minHeight: "120px" }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={2.4}>
              <MiniStatisticsCard
                title={{ text: "Type of Stock", sx: { fontSize: "1.5rem" } }}
                count={
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{stocksData?.type}</span>
                }
                icon={{ color: "info", component: getIcon("Type of Stock") }}
                sx={{ width: "100%", height: "100%", minHeight: "120px" }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="0px">
            <Grid item xs={12}>
              <CompanyDescription />
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
              <Card sx={{ height: "100%" }}>
                <VuiBox>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Stock Price Overview
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                    {/* <VuiTypography variant="button" color="success" fontWeight="bold">
                      +5% more{" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </VuiTypography>
                    </VuiTypography> */}
                  </VuiBox>
                  <VuiBox>
                    <LineChart
                      lineChartOptions={lineChartOptionsDashboard}
                      newprice={priceData}
                    />
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} xl={5}>
              <Card sx={{ height: "100%" }}>
                <VuiBox>
                  <VuiBox
                    mb="24px"
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
                      barChartData={chartConfig?.barChartData}
                      barChartOptions={chartConfig?.barChartOptions}
                    />
                  </VuiBox>
                  <VuiBox mb="10px">
                    <VuiTypography variant="lg" color="white" fontWeight="bold">
                      Financials
                    </VuiTypography>
                  </VuiBox>
                  <Grid container spacing="5px">
                    <Grid item xs={6} md={3} lg={6}>
                      <Stack direction="row" spacing={{ sm: "10px", xl: "1px", xxl: "10px" }} mb="6px">
                        <VuiTypography color="text" variant="button">Forward P/E</VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {(StatisticsData?.statistics?.valuations_metrics?.forward_pe ?? 0).toFixed(3)}
                      </VuiTypography>
                      <VuiProgress value={10} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>

                    <Grid item xs={6} md={3} lg={6}>
                      <Stack direction="row" spacing={{ sm: "10px", xl: "1px", xxl: "10px" }} mb="6px">
                        <VuiTypography color="text" variant="button">Price/Sales (P/S)</VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {(StatisticsData?.statistics?.valuations_metrics?.price_to_sales_ttm ?? 0).toFixed(3)}
                      </VuiTypography>
                      <VuiProgress value={10} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>

                    <Grid item xs={6} md={3} lg={6}>
                      <Stack direction="row" spacing={{ sm: "10px", xl: "1px", xxl: "10px" }} mb="6px">
                        <VuiTypography color="text" variant="button">Enterprise Value / EBITDA</VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {(StatisticsData?.statistics?.valuations_metrics?.enterprise_to_ebitda ?? 0).toFixed(3)}
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>

                    <Grid item xs={6} md={3} lg={6}>
                      <Stack direction="row" spacing={{ sm: "10px", xl: "1px", xxl: "10px" }} mb="6px">
                        <VuiTypography color="text" variant="button">Forward Annual Dividend Rate</VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {(StatisticsData?.statistics?.dividends_and_splits?.forward_annual_dividend_yield ?? 0).toFixed(3)}
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
