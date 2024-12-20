/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useRef, useEffect, useState, useMemo, Suspense, useContext } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React helper functions
import gradientChartLine from "assets/theme/functions/gradientChartLine";

// GradientLineChart configurations
import configs from "examples/Charts/LineCharts/GradientLineChart/configs";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import { Box, CardContent, Paper, Typography } from "@mui/material";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { AuthContext } from "context/Authcontext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import ReactApexChart from "react-apexcharts";

function GradientLineChart({ newprice, selectedStock }) {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1d");
  const [isClient, setIsClient] = useState(false);
  const stockData = useContext(AuthContext);
  const timeZoneRef = useRef(null);
  const lastPriceRef = useRef(null);
  const chartContainerRef = useRef(null);
  const currentMinutePricesRef = useRef([]);
  const lastMinuteRef = useRef(null);
  const [graphApi, setGraphApi] = useState([]);
  const location = useLocation();

  // Check if the current route is the dashboard route
  const isDashboardRoute = location.pathname === '/dashboard';

  const [stockDetails, setStockDetails] = useState({
    selectedSymbol: selectedStock?.symbol || stockData?.stockData?.symbol,
    selectedExchange: selectedStock?.exchange || stockData?.stockData?.exchange,
    selectedStocksHigh: parseFloat(stockData?.stockData?.high),
    selectedStocksLow: parseFloat(stockData?.stockData?.low),
    selectedStocksChange: stockData?.stockData?.percent_change,
  });

  useEffect(() => {
    setStockDetails({
      selectedSymbol: selectedStock?.symbol || stockData?.stockData?.symbol,
      selectedExchange: selectedStock?.exchange || stockData?.stockData?.exchange,
    });
  }, [selectedStock, stockData?.stockData?.symbol, stockData?.stockData?.exchange]);


  const isPositive = stockDetails?.selectedStocksChange >= 0;

  const getCurrencySymbol = (exchange) => {
    const exchangeCurrency = {
      NSE: '₹',
      BSE: '₹',
      NYSE: '$',
      NASDAQ: '$',
      LSE: '£',
      default: '$'
    };
    return exchangeCurrency[exchange] || exchangeCurrency.default;
  };

  const currencySymbol = getCurrencySymbol(stockDetails?.selectedExchange);

  const getDateTimeFormatter = (period, timezone) => {
    switch (period) {
      case "1d":
        return (value) => moment.tz(value, timezone).format("HH:mm");
      case "1w":
        return (value) => moment.tz(value, timezone).format("DD MMM");
      case "1m":
        return (value) => moment.tz(value, timezone).format("DD MMM");
      case "1y":
        return (value) => moment.tz(value, timezone).format("MMM YYYY");
      case "5y":
        return (value) => moment.tz(value, timezone).format("YYYY");
      default:
        return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
    }
  };

  const getTooltipFormatter = (period, timezone) => {
    switch (period) {
      case "1d":
        return (value) => moment.tz(value, timezone).format("HH:mm");
      case "1w":
        return (value) => moment.tz(value, timezone).format("HH:mm");
      default:
        return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
    }
  };

  const calculateMinuteAverage = (prices) => {
    if (!prices || prices.length === 0) return null;
    const sum = prices.reduce((acc, price) => acc + parseFloat(price), 0);
    return sum / prices.length;
  };

  const updateChartWithNewPrice = (currentData, newPrice, timezone) => {
    if (!currentData?.[0]?.data || !newPrice?.close) return currentData;

    const currentTime = moment().tz(timezone);
    const currentMinute = currentTime.startOf('minute');
    const currentMinuteStr = currentMinute.format('YYYY-MM-DD HH:mm');

    // If we're in a new minute, process the accumulated data from the previous minute
    if (currentMinuteStr !== lastMinuteRef.current) {
      // Calculate average price for the previous minute if we have accumulated prices
      if (currentMinutePricesRef.current.length > 0) {
        const averagePrice = calculateMinuteAverage(currentMinutePricesRef.current);

        // Create a new data array with the previous minute's average
        const updatedData = [...currentData];
        const newDataPoint = {
          x: moment(lastMinuteRef.current, 'YYYY-MM-DD HH:mm').valueOf(),
          y: averagePrice
        };

        // Only add if we don't already have data for this minute
        if (!updatedData[0].data.some(point =>
          moment(point.x).format('YYYY-MM-DD HH:mm') === lastMinuteRef.current
        )) {
          updatedData[0] = {
            ...updatedData[0],
            data: [...updatedData[0].data, newDataPoint].sort((a, b) => a.x - b.x)
          };
        }

        // Reset for the new minute
        currentMinutePricesRef.current = [parseFloat(newPrice.close)];
        lastMinuteRef.current = currentMinuteStr;

        // Remove data points older than 24 hours if in 1d view
        if (timePeriod === "1d") {
          const oneDayAgo = moment().tz(timezone).subtract(1, 'day').valueOf();
          updatedData[0].data = updatedData[0].data.filter(point => point.x >= oneDayAgo);
        }

        return updatedData;
      }

      // If this is the first data point for a new minute
      lastMinuteRef.current = currentMinuteStr;
      currentMinutePricesRef.current = [parseFloat(newPrice.close)];
    } else {
      // Accumulate prices for the current minute
      currentMinutePricesRef.current.push(parseFloat(newPrice.close));
    }

    return currentData;
  };

  const fetchData = async (timePeriod) => {
    if (!stockDetails.selectedSymbol || !stockDetails.selectedExchange) {
      setError("Missing symbol or exchange information");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response = await axios.get(
        `https://rcapidev.neosme.co:2053/stock_price_graph/${stockDetails.selectedSymbol}/${timePeriod}/${stockDetails.selectedExchange}`
      );

      const data = response.data;
      console.log('values', data);
      const values = data.values;
      setGraphApi(values);


      if (timePeriod === '1d' && data.meta.interval === '1min') {
        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;

        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange: result
        }));
      }

      if (timePeriod === "1w" && data.meta.interval === "1min") {
        // const values = data.values;

        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;

        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange: result
        }));
      }

      if (timePeriod === "1m" && data.meta.interval === "1day") {
        // const values = data.values;

        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;

        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange: result
        }));
      }


      if (timePeriod === "1y" && data.meta.interval === "1day") {
        // const values = data.values;

        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;

        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange: result
        }));
      }

      if (timePeriod === "5y" && data.meta.interval === "1day") {
        // const values = data.values;

        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;

        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange: result
        }));
      }
      timeZoneRef.current = data.meta.exchange_timezone;

      let processedValues = values;

      if (timePeriod === "1d") {
        const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");
        processedValues = data.values.filter((item) => {
          const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
          return itemDate === today;
        });

        // Reset minute tracking when fetching new data
        lastMinuteRef.current = null;
        currentMinutePricesRef.current = [];
      }

      const formattedData = [{
        name: "Price",
        data: processedValues.map((item) => ({
          x: moment.tz(item.datetime, data.meta.exchange_timezone).valueOf(),
          y: parseFloat(item.close),
        })),
      }];

      const options = {
        chart: {
          id: `stock-chart-${stockDetails?.selectedSymbol}`,
          type: "line",
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          background: 'transparent',
        },
        stroke: {
          width: 2,
        },
        colors: ['#0075FF'],
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              colors: "#000",
              fontSize: "12px",
            },
            formatter: getDateTimeFormatter(timePeriod, data.meta.exchange_timezone),
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#000",
              fontSize: "12px",
            },
            formatter: (value) => `${currencySymbol}${value.toFixed(2)}`,
          },
          forceNiceScale: true,
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: getTooltipFormatter(timePeriod, data.meta.exchange_timezone),
          },
          y: {
            formatter: (value) => `${currencySymbol}${value.toFixed(2)}`,
          },
        },
        grid: {
          strokeDashArray: 5,
          borderColor: "#56577A",
        },
      };

      setChartData(formattedData);
      setChartOptions(options);
      setLoading(false);
    } catch (error) {
      let response = await axios.get(
        `https://rcapidev.neosme.co:2053/stock_price_graph/${stockDetails.selectedSymbol}/1w/${stockDetails.selectedExchange}`
      );

      const data = response.data;
      const processedValues = data.values;
      setGraphApi(processedValues);


      const formattedData = [{
        name: "Price",
        data: processedValues.map((item) => ({
          x: moment.tz(item.datetime, data.meta.exchange_timezone).valueOf(),
          y: parseFloat(item.close),
        })),
      }];

      const options = {
        chart: {
          id: `stock-chart-${stockDetails?.selectedSymbol}`,
          type: "line",
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          background: 'transparent',
        },
        stroke: {
          width: 2,
        },
        colors: ['#0075FF'],
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "12px",
            },
            formatter: getDateTimeFormatter('1w', data.meta.exchange_timezone),
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "12px",
            },
            formatter: (value) => `${currencySymbol}${value.toFixed(2)}`,
          },
          forceNiceScale: true,
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: getTooltipFormatter('1w', data.meta.exchange_timezone),
          },
          y: {
            formatter: (value) => `${currencySymbol}${value.toFixed(2)}`,
          },
        },
        grid: {
          strokeDashArray: 5,
          borderColor: "#56577A",
        },
      };

      setChartData(formattedData);
      setChartOptions(options);

      console.error("Error fetching the stock data: ", error);
      setLoading(false);
      setGraphApi([]);
      setError("Error fetching the stock data");
    }
  };

  useEffect(() => {
    setIsClient(true);
    return () => setIsClient(false);
  }, []);

  useEffect(() => {
    if (isClient && stockDetails?.selectedSymbol && stockDetails?.selectedExchange) {
      fetchData(timePeriod);
    }
  }, [timePeriod, stockDetails?.selectedSymbol, stockDetails?.selectedExchange, isClient]);


  useEffect(() => {
    if (isClient && newprice && timeZoneRef.current && timePeriod === "1d") {
      setChartData((prevData) => {
        const updatedData = updateChartWithNewPrice(prevData, newprice, timeZoneRef.current);
        return updatedData;
      });
    }
  }, [newprice]);

  const handleTimePeriodChange = (newPeriod) => {
    setTimePeriod(newPeriod);
    // Reset minute tracking when changing time period
    lastMinuteRef.current = null;
    currentMinutePricesRef.current = [];
  };

  if (!isClient) return null;
  if (loading) {
    return (
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }


  console.log('graphApi ', graphApi.length);

  return (
    <Card
      elevation={3}
      sx={{
        padding: { xs: '20px', md: '20px' }, // Responsive padding
        borderRadius: '12px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        color: '#000',
      }}
    >
        <SoftTypography color="black" variant="lg" mb="10px" gutterBottom fontWeight="bold">
          Stock Price Overview
        </SoftTypography>
      <CardContent>
        {/* Title */}
  
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Responsive flex direction
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          {/* Cards for High, Low, and Returns */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' }, // Responsive flex direction
              justifyContent: 'space-around',
              fontSize: { xs: '10px', md: '12px' }, // Responsive font size
              gap: { xs: '12px', md: '18px' }, // Responsive gap
            }}
          >
            {/* High */}
            {graphApi?.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  High
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: '14px', marginTop: '4px' }}
                >
                  {currencySymbol}
                  {stockDetails?.selectedStocksHigh?.toFixed(2)}
                </Typography>
              </div>
            )}
  
            {/* Low */}
            {graphApi?.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Low
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: '14px', marginTop: '4px' }}
                >
                  {currencySymbol}
                  {stockDetails?.selectedStocksLow?.toFixed(2)}
                </Typography>
              </div>
            )}
  
            {/* Returns */}
            {graphApi?.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Returns
                </Typography>
                <Typography
                  sx={{
                    color: isPositive ? '#26C281' : '#ed3419',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginTop: '4px',
                  }}
                >
                  {isPositive ? <FaCaretUp /> : <FaCaretDown />}
                  {isDashboardRoute && timePeriod === '1d'
                    ? newprice?.percent_change?.toFixed(2)
                    : stockDetails.selectedStocksChange?.toFixed(2)}
                  %
                </Typography>
              </div>
            )}
          </Box>
  
          {/* Time Period Buttons */}
          <Box
            sx={{
              display: { xs: 'column', md: 'flex' }, // Responsive display for buttons
              gap: '15px',
              mt: '20px',
            }}
          >
            {['5y', '1y', '1m', '1w', '1d'].map((period) => (
              <button
                key={period}
                onClick={() => handleTimePeriodChange(period)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: timePeriod === period ? '#0075FF' : '#e0e0e0',
                  color: timePeriod === period ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </Box>
        </Box>
  
        {/* Chart Section */}
        <div
          style={{
            height: '250px',
            width: '100%',
            marginTop: '20px',
          }}
          ref={chartContainerRef}
        >
          {chartData[0]?.data?.length > 0 && (
            <Suspense fallback={<div>Loading chart...</div>}>
              <ReactApexChart
                key={`${stockDetails.selectedSymbol}-${timePeriod}-${stockDetails.selectedExchange}`}
                series={chartData}
                options={chartOptions}
                type="line"
                height="100%"
                width="100%"
              />
            </Suspense>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
GradientLineChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
  newprice: {},
  selectedStock: {},
};

// Typechecking props for the DefaultLineChart
GradientLineChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
  newprice: PropTypes.object.isRequired,
  selectedStock: PropTypes.object.isRequired,
};

export default GradientLineChart;
