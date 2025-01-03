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
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// RiskCompass AI React components
import SoftBox from "/src/components/SoftBox";
import SoftTypography from "/src/components/SoftTypography";

// RiskCompass AI React examples
import DashboardLayout from "/src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/src/examples/Navbars/DashboardNavbar";
import Footer from "/src/examples/Footer";
import MiniStatisticsCard from "/src/examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "/src/examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "/src/examples/Charts/LineCharts/GradientLineChart";

import { DollarSign, Users, Award, BarChart,LucideArrowDownUp } from 'lucide-react';


// RiskCompass AI React base styles
import typography from "/src/assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "/src/layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "/src/layouts/dashboard/components/WorkWithTheRockets";
import Projects from "/src/layouts/dashboard/components/Projects";
import OrderOverview from "/src/layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "/src/layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "/src/layouts/dashboard/data/gradientLineChartData";
import { FaCaretDown, FaCaretUp, FaMoneyBillWave,FaBalanceScaleLeft } from "react-icons/fa";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "/src/context/Authcontext";
import { supabase } from "/src/lib/supabase";
import axios from "axios";
import moment from "moment-timezone";
import { Card, Stack } from "@mui/material";
import SoftProgress from "/src/components/SoftProgress";
import WelcomeMark from "./components/WelcomeMark";
import CompanyDescription from "./components/CompanySummary";


import { FaMagnifyingGlassChart, FaArrowUpWideShort, FaSort } from "react-icons/fa6";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { IoGlobe } from "react-icons/io5";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const stockData = useContext(AuthContext);
  // const [stocks, setStocks] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const navigate = useNavigate();


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
    "previous_close": "0",
    "volume": "260940306",
    "close": "24620.50000",
    "is_market_open": false,
    "trading_date": "N/A",
    "last_updated": "2024-12-10T10:25:18.239145"
  };

  const [stocksData, setStocksData] = useState(null)
  const [previousClose, setPreviousClose] = useState(null)
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);


  const [StatisticsData, setStatisticsData] = useState({
    statistics: {
      valuations_metrics: {
        forward_pe: 0.000,
        price_to_sales_ttm: 0.000,
        enterprise_to_ebitda: 0.000,
      },
      dividends_and_splits: {
        forward_annual_dividend_yield: 0.000,
      },
    }
  });


  const [indicators, setIndicators] = useState({
    "symbol": "NSEI",
    "exchange": "NSE",
    "current_price": 736.099976,
    "signals": {
      "macd": {
        "datetime": "2024-12-24",
        "macd": -22.41159,
        "macd_signal": -18.16149,
        "signal": "SELL"
      },
      "vwap": {
        "datetime": "2024-12-24",
        "vwap": 734.63332,
        "current_price": 736.099976,
        "signal": "SELL"
      },
      "sma": {
        "datetime": "2024-12-24",
        "sma": 777.9825,
        "current_price": 736.099976,
        "signal": "SELL"
      },
      "long_sma": {
        "datetime": "2024-12-24",
        "sma": 954.72425,
        "current_price": 736.099976,
        "signal": "SELL"
      }
    }
  }
  )


  const [chartConfig, setChartConfig] = useState({
    barChartData: [],
    barColors: [],
    barChartOptions: {}
  });


  useEffect(() => {
    if (!indicators) return;

    console.log('indicators', indicators);

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
      indicators?.signals?.sma?.signal === "SELL" ? '#ef4444' : '#22c55e',
      indicators?.signals?.long_sma?.signal === "SELL" ? '#ef4444' : '#22c55e',
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
          fontFamily: "Roboto Helvetica Arial sans-serif",
        },
        theme: "dark",
        y: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            const values = [
              indicators?.signals?.macd?.macd,
              indicators?.signals?.vwap?.vwap,
              indicators?.signals?.sma?.sma,
              indicators?.signals?.sma?.sma
            ];
            return values[dataPointIndex];
          }
        }
      },
      xaxis: {
        categories: ["MACD", "VWAP", "SMA", "LONG_SMA"],
        labels: {
          style: {
            colors: "#000",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        show: false,
        labels: {
          style: {
            colors: "#000",
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
      // title: {
      //   text: `Technical Indicators : ${indicators?.symbol}`,
      //   style: {
      //     color: "#000",
      //     fontSize: "14px",
      //   },
      // }
    };

    setChartConfig({
      barChartData,
      barColors,
      barChartOptions
    });
  }, [indicators]);

  const fetchStatistics = async () => {
    try {
      const response = await axios(`https://rcapidev.neosme.co:2053/statistics/${stockData?.stockData?.symbol || 'NSEI'}/${stockData?.stockData?.exchange || 'NSE'}`);
      const data = response.data;

      if (data) {
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
      const response = await axios(`https://rcapidev.neosme.co:2053/technical-analysis/${stockData?.stockData?.symbol || 'NSEI'}/${stockData?.stockData?.exchange || 'NSE'}`);
      const data = response.data;
      if (data) {
        setIndicators(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.log('Error fetching statistics:', error);
    }
  }

  const fetchPreviousClose = async () => {
    try {
      const response = await axios(`https://rcapidev.neosme.co:2053/search/NSEI`);
      const data = response.data;
      console.log('datadatadata', data);
      if (data) {
        setPreviousClose({
          previous_close: data[0]?.previous_close,
          high: data[0]?.fifty_two_week?.high,
          low: data[0]?.fifty_two_week?.low
        });

      } else {
        console.log('No data available');
      }
    }
    catch (error) {
      console.log('Error fetching previous_close:', error);
    }
  }

  useEffect(() => {
    if (!stockData?.stockData || stockData.stockData.length === 0) {
      setStocksData(initialStockData);
    } else {
      setStocksData(stockData.stockData);
    }

    fetchStatistics();
    fetchIndicators();
    fetchPreviousClose();

    // navigate(`/dashboard/${stockData?.stockData?.symbol || 'NSEI'}`);  
  }, [stockData, stockData?.stockData?.symbol, stockData?.stockData?.exchange]);


  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  const fetchStockData = async () => {

    try {
      const { data, error } = await supabase.from("price")
        .select("*")
        .eq("symbol", `${stocksData?.symbol}`)
        .eq("exchange", `${stocksData?.exchange}`)
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

  // const fetchDailyStock = async () => {

  //   try {
  //     const { data, error } = await supabase
  //       .from("stock_daily_summary")
  //       .select("*")
  //       .eq("symbol", `${stockData?.stockData?.symbol}`)
  //       .eq("exchange", `${stockData?.stockData?.exchange}`)
  //       .order("trading_date", { ascending: false }) // Sort by 'trading_date' in descending order
  //       .limit(1);

  //     if (error) throw error;
  //     if (data) setStocksPercent(data);
  //   } catch (error) {
  //     console.log("Error fetching stocks:", error);
  //   }
  // };


  const fetchStockSymbols = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("stocks")
        .select("symbol, exchange")
        .eq("symbol", stocksData?.symbol)
        .eq("exchange", stocksData?.exchange)

      if (data) {
        setSymbols_data(data); // Wrap in an array to maintain consistency
      } else {
        setSymbols_data([]); // Ensure empty array if no data
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setSymbols_data([]);
    }
  }, [stocksData?.symbol, stocksData?.exchange]);

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
    // Determine data source and update price

    if (websocketStocks?.symbol === stockData?.stockData?.symbol &&
      websocketStocks?.exchange === stockData?.stockData?.exchange &&
      stockData?.stockData?.symbol !== undefined
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
      const New_price = supabaseStocks[0]?.price;
      const previous_close = stocksData?.previous_close === '0' ? previousClose.previous_close : stocksData?.previous_close;

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

    // if (!stockData?.stockData?.symbol || !stockData?.stockData?.exchange) return;

    // Clear previous data when changing stocks
    setWebsocketStocks(null);
    setSupabaseStocks([]);

    if (symbols_data.length > 0) {
      // For Indian stocks
      fetchStockData();
      // fetchDailyStock();

      const channel_1 = supabase
        .channel("price-channel")
        .on("postgres_changes", { event: "*", schema: "public", table: "price" }, (payload) => {
          const { eventType, new: newStock } = payload;

          if (newStock.symbol === stocksData?.symbol) {
            setSupabaseStocks(() => {
              switch (eventType) {
                case "INSERT":
                case "UPDATE":
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
  }, [stockData?.stockData?.symbol, stockData?.stockData?.exchange, symbols_data]);


  const getIcon = (title) => {
    switch (title) {
      case "Currency & Exchange":
        return <DollarSign size={22} />;
      case "MIC Code & Country":
        return <IoGlobe size={22} />;
      case "Type of Stock":
        return <Award size={22} />;
      case "High & Low":
        return <LucideArrowDownUp size={22} />;
      default:
        return <BarChart size={22} />;
    }
  };


  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <SoftBox py={1}>
        <SoftBox mb={3}>
          <Grid container spacing={2}>
            {/* Stock Price Card */}
            <Grid item xs={12} md={6} xl={3.7}>
              <MiniStatisticsCard
                title={{
                  text: stocksData?.company_name?.length > 40
                    ? stocksData?.company_name.slice(0, 30) + '...'
                    : stocksData?.company_name,
                }}
                count={
                  <span >
                    {priceData?.New_price?.toFixed(2)}
                  </span>
                }
                percentage={{
                  color: priceData?.percentageColor,
                  text: (
                    <>
                      {`${priceData?.price_change?.toFixed(2)} (${priceData?.percent_change?.toFixed(2)}%)`}
                    </>
                  ),
                  fontSize: "0.875rem"
                }}
                icon={{
                  color: "black",
                  component: getIcon(),
                }}
              />
            </Grid>

            {/* Currency & Exchange Card */}
            <Grid item xs={12} md={6} xl={2.7}>
              <MiniStatisticsCard
                title={{
                  text: "Currency & Exchange",
                }}
                count={
                  <span
                  >
                    {`${stocksData?.currency} / ${stocksData?.exchange}`}
                  </span>
                }
                icon={{
                  color: "black",
                  component: getIcon("Currency & Exchange")
                }}
              />
            </Grid>

            {/* Symbol & Country Card */}
            <Grid item xs={12} md={6} xl={2.8}>
              <MiniStatisticsCard
                title={{
                  text: "Symbol & Country",
                }}
                count={
                  <span
                  >
                    {`${stocksData?.symbol}, ${stocksData?.country}`}
                  </span>
                }
                icon={{
                  color: "black",
                  component: getIcon("MIC Code & Country")
                }}
              />
            </Grid>

            {/* Type of Stock Card */}
            <Grid item xs={12} md={6} xl={2.8}>
              <MiniStatisticsCard
                title={{
                  text: "52 Week High & Low",
                }}
                count={
                  <span
                    style={{
                      fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem', lg: '0.5rem' }, // Font size breakpoints
                    }}
                  >
                    {(stocksData?.fifty_two_week?.high && stocksData?.fifty_two_week?.low)
                      ? `${Number(stocksData.fifty_two_week.high).toFixed(2)} & ${Number(stocksData.fifty_two_week.low).toFixed(2)}`
                      : (previousClose?.high && previousClose?.low)
                        ? `${Number(previousClose.high).toFixed(2)} & ${Number(previousClose.low).toFixed(2)}`
                        : null}
                  </span>
                }
                icon={{
                  color: "black",
                  component: getIcon("High & Low")
                }}
              />
            </Grid>
          </Grid>
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            color: "gray",
            display: "block",
            marginLeft: '10px'
          }}>
            {`As on ${moment(stocksData?.last_updated).format("DD MMM, YYYY | HH:mm")}`}
          </span>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <CompanyDescription />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Card sx={{ height: "100%", padding: "16px", color: 'rgb(103, 116, 142)' }}>
                <SoftTypography color="gray" variant="lg" mb="2px" gutterBottom fontWeight="bold">
                  Technical Indicators
                </SoftTypography>
                <SoftBox>
                  <SoftBox
                    mb="24px"
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      color: '#000' // Light gray transparent background
                    }}
                  >
                    <ReportsBarChart
                      barChartData={chartConfig?.barChartData}
                      barChartOptions={chartConfig?.barChartOptions}
                    />
                  </SoftBox>

                  <SoftBox mb="10px">
                    <SoftTypography variant="sm" fontWeight="bold" color="text">
                      Financials
                    </SoftTypography>
                  </SoftBox>
                  <Grid container spacing="5px">
                    <Grid item xs={6} md={6} lg={3}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ sm: "8px", xl: "1px", xxl: "8px" }}
                        mb="6px"
                      >
                        <FaArrowUpWideShort
                          style={{
                            padding: "5px",
                            display: "flex",
                            WebkitBoxPack: "center",
                            justifyContent: "center",
                            WebkitBoxAlign: "center",
                            alignItems: "center",
                            opacity: 1,
                            fontSize: "30px",
                            background:
                              "linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))",
                            color: "rgb(255, 255, 255)",
                            borderRadius: "0.5rem",
                            boxShadow:
                              "rgba(20, 20, 20, 0.12) 0rem 0.25rem 0.375rem -0.0625rem, rgba(20, 20, 20, 0.07) 0rem 0.125rem 0.25rem -0.0625rem",
                            marginRight: '5px'
                          }}
                        />
                        <SoftTypography color="text" variant="button" fontSize="xxs">
                          Forward P/E
                        </SoftTypography>
                      </Stack>
                      <SoftTypography color="dark" variant="xxs" fontWeight="bold" mb="8px">
                        {(StatisticsData?.statistics?.valuations_metrics?.forward_pe ?? 0).toFixed(
                          3
                        )}
                      </SoftTypography>
                      <SoftProgress
                        value={(
                          StatisticsData?.statistics?.valuations_metrics?.forward_pe ?? 0
                        ).toFixed(3)}
                        color="info"
                        sx={{ background: "#2D2E5F" }}
                      />
                    </Grid>

                    <Grid item xs={6} md={6} lg={2.5}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ sm: "8px", xl: "1px", xxl: "8px" }}
                        mb="6px"
                      >
                        <FaMagnifyingGlassChart style={{
                          padding: "5px",
                          display: "flex",
                          WebkitBoxPack: "center",
                          justifyContent: "center",
                          WebkitBoxAlign: "center",
                          alignItems: "center",
                          opacity: 1,
                          fontSize: "30px",
                          background:
                            "linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))",
                          color: "rgb(255, 255, 255)",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "rgba(20, 20, 20, 0.12) 0rem 0.25rem 0.375rem -0.0625rem, rgba(20, 20, 20, 0.07) 0rem 0.125rem 0.25rem -0.0625rem",
                          marginRight: '5px'
                        }} />
                        <SoftTypography color="text" variant="button" fontSize="xxs">
                          Price/Sales (P/S)
                        </SoftTypography>
                      </Stack>
                      <SoftTypography color="dark" variant="xxs" fontWeight="bold" mb="8px">
                        {(
                          StatisticsData?.statistics?.valuations_metrics?.price_to_sales_ttm ?? 0
                        ).toFixed(3)}
                      </SoftTypography>
                      <SoftProgress
                        value={(
                          StatisticsData?.statistics?.valuations_metrics?.price_to_sales_ttm ?? 0
                        ).toFixed(3)}
                        color="info"
                        sx={{ background: "#2D2E5F" }}
                      />
                    </Grid>

                    <Grid item xs={6} md={6} lg={3}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ sm: "8px", xl: "1px", xxl: "8px" }}
                        mb="6px"
                      >
                        <FaBalanceScaleLeft style={{
                          padding: "5px",
                          display: "flex",
                          WebkitBoxPack: "center",
                          justifyContent: "center",
                          WebkitBoxAlign: "center",
                          alignItems: "center",
                          opacity: 1,
                          fontSize: "30px",
                          background:
                            "linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))",
                          color: "rgb(255, 255, 255)",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "rgba(20, 20, 20, 0.12) 0rem 0.25rem 0.375rem -0.0625rem, rgba(20, 20, 20, 0.07) 0rem 0.125rem 0.25rem -0.0625rem",
                          marginRight: '5px'
                        }} />
                        <SoftTypography color="text" variant="button" fontSize="xxs">
                          Enterprise Value / EBITDA
                        </SoftTypography>
                      </Stack>
                      <SoftTypography
                        color="dark"
                        alignItems="center"
                        variant="xxs"
                        fontWeight="bold"
                        mb="8px"
                      >
                        {(
                          StatisticsData?.statistics?.valuations_metrics?.enterprise_to_ebitda ?? 0
                        ).toFixed(3)}
                      </SoftTypography>
                      <SoftProgress
                        value={(
                          StatisticsData?.statistics?.valuations_metrics?.enterprise_to_ebitda ?? 0
                        ).toFixed(3)}
                        color="info"
                        sx={{ background: "#2D2E5F" }}
                      />
                    </Grid>

                    <Grid item xs={6} md={6} lg={3.5}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ sm: "8px", xl: "1px", xxl: "8px" }}
                        mb="6px"
                      >
                        <LiaFileInvoiceDollarSolid style={{
                          padding: "5px",
                          display: "flex",
                          WebkitBoxPack: "center",
                          justifyContent: "center",
                          WebkitBoxAlign: "center",
                          alignItems: "center",
                          opacity: 1,
                          fontSize: "30px",
                          background:
                            "linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))",
                          color: "rgb(255, 255, 255)",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "rgba(20, 20, 20, 0.12) 0rem 0.25rem 0.375rem -0.0625rem, rgba(20, 20, 20, 0.07) 0rem 0.125rem 0.25rem -0.0625rem",
                          marginRight: '5px'
                        }} />
                        <SoftTypography color="text" variant="button" fontSize="xxs" >
                          Forward Annual Dividend Rate
                        </SoftTypography>
                      </Stack>
                      <SoftTypography color="dark" variant="xxs" fontWeight="bold" mb="8px">
                        {(
                          StatisticsData?.statistics?.dividends_and_splits
                            ?.forward_annual_dividend_yield ?? 0
                        ).toFixed(3)}
                      </SoftTypography>
                      <SoftProgress
                        value={(
                          StatisticsData?.statistics?.dividends_and_splits
                            ?.forward_annual_dividend_yield ?? 0
                        ).toFixed(3)}
                        color="info"
                        sx={{ background: "#2D2E5F" }}
                      />
                    </Grid>
                  </Grid>

                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <GradientLineChart
                title="Stock Price Overview"
                newprice={priceData}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrderOverview />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <WelcomeMark stocksData={stocksData} />
            </Grid>
            <Grid item xs={12} lg={3}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={3}>
              <WorkWithTheRockets />
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;