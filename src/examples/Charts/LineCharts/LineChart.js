import React, { useState, useEffect, useContext, useRef, Suspense } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment-timezone";
import { AuthContext } from "context/Authcontext";
import { Box } from "@mui/material";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import axios from "axios";

const LineChart = ({ newprice, selectedStock }) => {
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
        selectedExchange: selectedStock?.exchange ||stockData?.stockData?.exchange,
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

      const response = await axios.get(
        `https://rcapidev.neosme.co:2053/stock_price_graph/${stockDetails.selectedSymbol}/${timePeriod}/${stockDetails.selectedExchange}`
      );

      if (!response?.data) {
        throw new Error("No data received from server");
      }

      const data = response.data;
      console.log('stockgraph',data);

      if (timePeriod === '1d' && data.meta.interval === '1min') {
        const values = data.values;
        console.log('values',values);
      
        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));
      
        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
        }));
      }

      if (timePeriod === "1m" && data.meta.interval === "1day") {
        const values = data.values;
      
        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;
      
        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange : result
        }));
      }
      
      if (timePeriod === "1y" && data.meta.interval === "1day") {
        const values = data.values;
      
        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;
      
        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange : result
        }));
      }
      
      if (timePeriod === "5y" && data.meta.interval === "1day") {
        const values = data.values;
      
        const maxHigh = Math.max(...values.map(entry => parseFloat(entry.high)));
        const minLow = Math.min(...values.map(entry => parseFloat(entry.low)));

        const endPrice = parseFloat(values[0].close);
        const startPrice = parseFloat(values[values.length - 1].open);
        const result = ((endPrice - startPrice) / startPrice) * 100;
      
        setStockDetails(prev => ({
          ...prev,
          selectedStocksHigh: maxHigh,
          selectedStocksLow: minLow,
          selectedStocksChange : result
        }));
      }
      timeZoneRef.current = data.meta.exchange_timezone;

      let processedValues = data.values;

      if (timePeriod === "1d") {
        const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");
        processedValues = data.values.filter((item) => {
          const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
          return itemDate === today;
        });

        if (processedValues.length === 0) {
          const sortedValues = data.values.sort((a, b) =>
            moment.tz(b.datetime, timeZoneRef.current).valueOf() -
            moment.tz(a.datetime, timeZoneRef.current).valueOf()
          );
          const mostRecentDate = moment.tz(sortedValues[0].datetime, timeZoneRef.current).format("YYYY-MM-DD");
          processedValues = sortedValues.filter((item) =>
            moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD") === mostRecentDate
          );
        }
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
              colors: "#FFFFFF",
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
      console.error("Error fetching the stock data: ", error);
      setLoading(false);
      setError(error.message || "Failed to load data");
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
  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            color: "#fff",
            fontSize: "12px",
            gap: "18px",
          }}
        >
          {/* High */}
          {stockDetails.selectedStocksHigh !== null && (
            <div style={{ textAlign: "center" }}>
              <div>High</div>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>
                {currencySymbol}
                {stockDetails?.selectedStocksHigh?.toFixed(2)}
              </div>
            </div>
          )}

          {/* Low */}
          {stockDetails.selectedStocksLow !== null && (
            <div style={{ textAlign: "center" }}>
              <div>Low</div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>
                {currencySymbol}
                {stockDetails?.selectedStocksLow?.toFixed(2)}
              </div>
            </div>
          )}

          {/* Returns */}
          {stockDetails.selectedStocksChange !== null && (
            <div style={{ textAlign: "center" }}>
              <div>Returns</div>
              <div
                style={{
                  color: isPositive ? "#26C281" : "#ed3419",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                {isPositive ? <FaCaretUp /> : <FaCaretDown />}
                {timePeriod === '1d' ? newprice?.percent_change?.toFixed(2) : stockDetails.selectedStocksChange?.toFixed(2)}%
              </div>
            </div>
          )}
        </Box>
        <Box display={"flex"} gap={"15px"}>
          {["5y", "1y", "1m", "1d"].map((period) => (
            <button
              key={period}
              onClick={() => handleTimePeriodChange(period)}
              style={{
                padding: "8px 16px",
                backgroundColor: timePeriod === period ? "#0075FF" : "#e0e0e0",
                color: timePeriod === period ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {period.toUpperCase()}
            </button>
          ))}
        </Box>
      </div>
      <div style={{ height: '250px', width: '100%' }} ref={chartContainerRef}>
        {chartData[0]?.data?.length > 0 && (
          <Suspense fallback={<div>Loading chart...</div>}>
            <ReactApexChart
              key={`${stockDetails.selectedSymbol}-${timePeriod}-${stockDetails.selectedExchange}`}
              options={chartOptions}
              series={chartData}
              type="line"
              height="100%"
              width="100%"
            />
          </Suspense>
        )}
        {!chartData[0]?.data?.length && (
          <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChart;