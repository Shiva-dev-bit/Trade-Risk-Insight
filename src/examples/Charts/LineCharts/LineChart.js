import React, { useState, useEffect, useContext, useRef, Suspense } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment-timezone";
import { AuthContext } from "context/Authcontext";
import { Box } from "@mui/material";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import  axios  from "axios";

const LineChart = ({ newprice }) => {
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

  let selectedSymbol = stockData?.stockData?.symbol;
  let selectedExchange = stockData?.stockData?.exchange;
  const selectedStocksHigh = parseFloat(stockData?.stockData?.high || 0)?.toFixed(2);
  const selectedStocksLow = parseFloat(stockData?.stockData?.low || 0)?.toFixed(2);
  let selectedStocksChange = stockData?.stockData?.percent_change;

  const isPositive = selectedStocksChange >= 0;

  // Currency symbol mapping
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

  const currencySymbol = getCurrencySymbol(selectedExchange);

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
        return (value) => moment.tz(value, timezone).format("HH:mm:ss");
      default:
        return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
    }
  };

  const updateChartWithNewPrice = (currentData, newPrice, timezone) => {
    if (!currentData?.[0]?.data || typeof newPrice !== "number") return currentData;

    const currentTime = moment().tz(timezone);
    const updatedData = [...currentData];
    
    const newDataPoint = {
      x: currentTime.valueOf(),
      y: newPrice,
    };

    updatedData[0] = {
      ...updatedData[0],
      data: [...updatedData[0].data, newDataPoint]
    };

    return updatedData;
  };

  const fetchData = async (timePeriod) => {
    if (!selectedSymbol || !selectedExchange) {
      setError("Missing symbol or exchange information");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://rcapidev.neosme.co:2053/stock_graph/${selectedSymbol}/${timePeriod}/${selectedExchange}`
      );

      if (!response?.data) {
        throw new Error("No data received from server");
      }

      const data = response.data;
      timeZoneRef.current = data.meta.exchange_timezone;

      let processedValues = data.values;

      if (timePeriod === "1d") {
        const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");       
        // Filter data for today or the most recent available day
        processedValues = data.values.filter((item) => {
          const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
          return itemDate === today;
        });  
        // If no data for today, get the most recent day's data
        if (processedValues.length === 0) {
          // Sort values by date in descending order and take the most recent day
          const sortedValues = data.values.sort((a, b) => 
            moment.tz(b.datetime, timeZoneRef.current).valueOf() - 
            moment.tz(a.datetime, timeZoneRef.current).valueOf()
          );
          // Take values from the most recent day
          const mostRecentDate = moment.tz(sortedValues[0].datetime, timeZoneRef.current).format("YYYY-MM-DD");
          processedValues = sortedValues.filter((item) => 
            moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD") === mostRecentDate
          );
        } 
        if (processedValues.length > 0) {
          // Set last price to the last entry of the most recent available day
          lastPriceRef.current = parseFloat(processedValues[processedValues.length - 1].close);         
        }
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
          id: `stock-chart-${selectedSymbol}`,
          type: "line",
          toolbar: { show: false },
          animations: {
            enabled: true,
            dynamicAnimation: { speed: 350 },
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

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    return () => setIsClient(false);
  }, []);

  // Handle data fetching
  useEffect(() => {
    if (isClient && selectedSymbol && selectedExchange) {
      fetchData(timePeriod);
    }
  }, [timePeriod, stockData, isClient]);

  // Handle real-time price updates
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
  };

  if (!isClient) {
    return null;
  }

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
          <div style={{ textAlign: "center" }}>
            <div>Today's High</div>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>{currencySymbol}{selectedStocksHigh}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div>Today's Low</div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>{currencySymbol}{selectedStocksLow}</div>
          </div>
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
              {Math.abs(selectedStocksChange)?.toFixed(2)}%
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div>Close</div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>
              {/* {newprice ? `${currencySymbol}${newprice}` : ""} */}
              {newprice ? `${currencySymbol}${newprice.close.toFixed(2)}` : ''}
            </div>
          </div>
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
              key={`${selectedSymbol}-${timePeriod}-${selectedExchange}-${chartData[0]?.data?.length}`}
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