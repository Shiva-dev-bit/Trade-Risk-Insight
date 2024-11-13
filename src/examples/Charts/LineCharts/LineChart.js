import React, { useState, useEffect, useContext, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment-timezone";
import { AuthContext } from "context/Authcontext";
import { Box } from "@mui/material";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

// const LineChart = ({ newprice }) => {
//   const [chartData, setChartData] = useState([]);
//   const [chartOptions, setChartOptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timePeriod, setTimePeriod] = useState("1d");
//   const stockData = useContext(AuthContext);
//   const timeZoneRef = useRef(null);
//   const lastCandleRef = useRef(null);

//   let selectedSymbol = stockData?.stockData?.symbol;
//   let selectedExchange = stockData?.stockData?.exchange;
//   const selectedStocksHigh = parseFloat(stockData?.stockData?.high || 0)?.toFixed(2);
//   const selectedStocksLow = parseFloat(stockData?.stockData?.low || 0)?.toFixed(2);
//   let selectedStocksChange = stockData?.stockData?.percent_change;

//   const isPositive = selectedStocksChange >= 0;

//   const getDateTimeFormatter = (period, timezone) => {
//     switch (period) {
//       case "1d":
//         return (value) => moment.tz(value, timezone).format("HH:mm");
//       case "1m":
//         return (value) => moment.tz(value, timezone).format("DD MMM");
//       case "1y":
//         return (value) => moment.tz(value, timezone).format("MMM YYYY");
//       case "5y":
//         return (value) => moment.tz(value, timezone).format("YYYY");
//       default:
//         return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
//     }
//   };

//   const getTooltipFormatter = (period, timezone) => {
//     switch (period) {
//       case "1d":
//         return (value) => moment.tz(value, timezone).format("HH:mm:ss");
//       default:
//         return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
//     }
//   };

//   const updateChartWithNewPrice = (currentData, newPrice, timezone) => {
//     if (!currentData[0]?.data?.length || typeof newPrice !== "number") return currentData;

//     const currentTime = moment().tz(timezone);
//     const updatedData = [...currentData];
//     const currentMinute = currentTime.startOf("minute");

//     let lastCandle = lastCandleRef.current;

//     // Initialize lastCandle with numeric defaults if it's undefined
//     if (!lastCandle) {
//       lastCandle = {
//         time: currentMinute,
//         open: newPrice,
//         high: newPrice,
//         low: newPrice,
//         close: newPrice,
//       };
//     }

//     // Ensure lastCandle has numeric values
//     lastCandle.open = typeof lastCandle.open === "number" ? lastCandle.open : newPrice;
//     lastCandle.high = typeof lastCandle.high === "number" ? lastCandle.high : newPrice;
//     lastCandle.low = typeof lastCandle.low === "number" ? lastCandle.low : newPrice;
//     lastCandle.close = typeof lastCandle.close === "number" ? lastCandle.close : newPrice;

//     if (currentMinute.isSame(lastCandle.time)) {
//       lastCandle.high = Math.max(lastCandle.high, newPrice);
//       lastCandle.low = Math.min(lastCandle.low, newPrice);
//       lastCandle.close = newPrice;
//     } else {
//       lastCandle = {
//         time: currentMinute,
//         open: lastCandle.close,
//         high: newPrice,
//         low: newPrice,
//         close: newPrice,
//       };
//     }

//     lastCandleRef.current = lastCandle;

//     if (timePeriod === "1d") {
//       const newDataPoint = {
//         x: lastCandle.time.valueOf(),
//         y: [
//           parseFloat(lastCandle.open.toFixed(2)),
//           parseFloat(lastCandle.high.toFixed(2)),
//           parseFloat(lastCandle.low.toFixed(2)),
//           parseFloat(lastCandle.close.toFixed(2)),
//         ],
//       };

//       const lastIndex = updatedData[0].data.findIndex((point) =>
//         moment(point.x).isSame(lastCandle.time, "minute")
//       );

//       if (lastIndex !== -1) {
//         updatedData[0].data[lastIndex] = newDataPoint;
//       } else {
//         updatedData[0].data.push(newDataPoint);
//       }

//       const startOfDay = currentTime.clone().startOf("day");
//       updatedData[0].data = updatedData[0].data.filter((point) =>
//         moment(point.x).isSameOrAfter(startOfDay)
//       );
//     }

//     return updatedData;
//   };

//   const fetchData = async (timePeriod) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(
//         `http://172.235.16.92:8000/stock_graph/${selectedSymbol}/${timePeriod}/${selectedExchange}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();

//       timeZoneRef.current = data.meta.exchange_timezone;

//       let processedValues = data.values;

//       if (timePeriod === "1d") {
//         const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");
//         processedValues = data.values.filter((item) => {
//           const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
//           return itemDate === today;
//         });

//         if (processedValues.length > 0) {
//           const lastValue = processedValues[processedValues.length - 1];
//           lastCandleRef.current = {
//             time: moment.tz(lastValue.datetime, timeZoneRef.current).startOf("minute"),
//             open: parseFloat(lastValue.open),
//             high: parseFloat(lastValue.high),
//             low: parseFloat(lastValue.low),
//             close: parseFloat(lastValue.close),
//           };
//         }
//       }

//       const formattedData = [
//         {
//           name: "Price", // Changed from default "Series 1" to "Price"
//           data: processedValues
//             .map((item) => ({
//               x: moment.tz(item.datetime, data.meta.exchange_timezone).valueOf(),
//               y: [
//                 parseFloat(item.open),
//                 parseFloat(item.high),
//                 parseFloat(item.low),
//                 parseFloat(item.close),
//               ],
//             }))
//             .filter((item) => !item.y.some((val) => val === null || isNaN(val))),
//         },
//       ];

//       const options = {
//         chart: {
//           type: "candlestick",
//           toolbar: {
//             show: false,
//           },
//           animations: {
//             enabled: true,
//             dynamicAnimation: {
//               enabled: true,
//               speed: 350,
//             },
//           },
//         },
//         xaxis: {
//           type: "datetime",
//           labels: {
//             style: {
//               colors: "#c8cfca",
//               fontSize: "10px",
//             },
//             formatter: getDateTimeFormatter(timePeriod, data.meta.exchange_timezone),
//           },
//           tickAmount: timePeriod === "1m" ? 10 : undefined,
//         },
//         yaxis: {
//           tooltip: {
//             enabled: true,
//           },
//           labels: {
//             style: {
//               colors: "#c8cfca",
//               fontSize: "10px",
//             },
//             formatter: (value) => value.toFixed(2),
//           },
//           forceNiceScale: true,
//         },
//         tooltip: {
//           theme: "dark",
//           x: {
//             formatter: getTooltipFormatter(timePeriod, data.meta.exchange_timezone),
//           },
//         },
//         grid: {
//           strokeDashArray: 5,
//           borderColor: "#56577A",
//         },
//         plotOptions: {
//           candlestick: {
//             colors: {
//               upward: "#26C281",
//               downward: "#ed3419",
//             },
//           },
//         },
//       };

//       if (timePeriod === "1d" && processedValues.length === 0) {
//         setError("No data available for today");
//       }

//       setChartData(formattedData);
//       setChartOptions(options);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching the stock data: ", error);
//       setLoading(false);
//       setError(error.message || "Failed to load data");
//     }
//   };

//   useEffect(() => {
//     fetchData(timePeriod);
//   }, [timePeriod, stockData]);

//   useEffect(() => {
//     if (newprice && timeZoneRef.current) {
//       const updatedChartData = updateChartWithNewPrice(chartData, newprice, timeZoneRef.current);
//       setChartData(updatedChartData);
//     }
//   }, [newprice]);

//   const handleTimePeriodChange = (newPeriod) => {
//     setTimePeriod(newPeriod);
//   };

//   if (loading) {
//     return (
//       <div className="lds-roller">
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//     );
//   }

//   if (error) {
//     return console.error("Error in Linechart", error);
//   }

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           // gap: "20px",
//           marginBottom: "20px",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             color: "#fff",
//             fontSize: "12px",
//             gap: "18px",
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <div>High</div>
//             <div style={{ fontWeight: 600, fontSize: "14px" }}>₹ {selectedStocksHigh}</div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div>Low</div>
//             <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {selectedStocksLow}</div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div>Returns</div>
//             <div
//               style={{
//                 color: isPositive ? "#26C281" : "#ed3419",
//                 display: "flex",
//                 alignItems: "center",
//                 fontWeight: 600,
//                 fontSize: "15px",
//               }}
//             >
//               {isPositive ? <FaCaretUp /> : <FaCaretDown />}
//               {Math.abs(selectedStocksChange)?.toFixed(2)}%
//             </div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div>Close</div>
//             <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {newprice}</div>
//           </div>
//         </Box>
//         <Box display={"flex"} gap={"15px"}>
//           {["5y", "1y", "1m", "1d"].map((period) => (
//             <button
//               key={period}
//               onClick={() => handleTimePeriodChange(period)}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor: timePeriod === period ? "#0075FF" : "#e0e0e0",
//                 color: timePeriod === period ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               {period.toUpperCase()}
//             </button>
//           ))}
//         </Box>
//       </div>
//       {chartData[0]?.data?.length > 0 ? (
//         <ReactApexChart
//           options={chartOptions}
//           series={chartData}
//           type="candlestick"
//           width="100%"
//           height="100%"
//         />
//       ) : (
//         <div style={{ textAlign: "center", padding: "20px" }}>No data available</div>
//       )}
//     </div>
//   );
// };

// export default LineChart;

// const LineChart = ({ newprice }) => {
//   const [chartData, setChartData] = useState([]);
//   const [chartOptions, setChartOptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timePeriod, setTimePeriod] = useState("1d");
//   const stockData = useContext(AuthContext);
//   const timeZoneRef = useRef(null);
//   const lastCandleRef = useRef(null);
//   const intervalRef = useRef(null);

//   let selectedSymbol = stockData?.stockData?.symbol;
//   let selectedExchange = stockData?.stockData?.exchange;
//   const selectedStocksHigh = parseFloat(stockData?.stockData?.high || 0)?.toFixed(2);
//   const selectedStocksLow = parseFloat(stockData?.stockData?.low || 0)?.toFixed(2);
//   let selectedStocksChange = stockData?.stockData?.percent_change;

//   const isPositive = selectedStocksChange >= 0;

//   const getDateTimeFormatter = (period, timezone) => {
//     switch (period) {
//       case "1d":
//         return (value) => moment.tz(value, timezone).format("HH:mm");
//       case "1m":
//         return (value) => moment.tz(value, timezone).format("DD MMM");
//       case "1y":
//         return (value) => moment.tz(value, timezone).format("MMM YYYY");
//       case "5y":
//         return (value) => moment.tz(value, timezone).format("YYYY");
//       default:
//         return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
//     }
//   };

//   const getTooltipFormatter = (period, timezone) => {
//     switch (period) {
//       case "1d":
//         return (value) => moment.tz(value, timezone).format("HH:mm:ss");
//       default:
//         return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
//     }
//   };

//   const updateChartWithNewPrice = (currentData, newPrice, timezone) => {
//     console.log("newPrice2222", newPrice);
//     if (newPrice !== "") {
//       console.log("retutninnnnng");
//       return currentData;
//     }

//     const currentTime = moment().tz(timezone);
//     const updatedData = [...currentData];
//     const currentMinute = currentTime.startOf("minute");

//     let lastCandle = lastCandleRef.current;

//     if (!lastCandle || !moment(lastCandle.time).isSame(currentMinute)) {
//       // Create new candle for new minute
//       lastCandle = {
//         time: currentMinute,
//         open: newPrice,
//         high: newPrice,
//         low: newPrice,
//         close: newPrice,
//       };

//       console.log("lastCandle", lastCandle);
//     } else {
//       // Update existing candle
//       lastCandle.high = Math.max(lastCandle.high, newPrice);
//       lastCandle.low = Math.min(lastCandle.low, newPrice);
//       lastCandle.close = newPrice;
//     }

//     lastCandleRef.current = lastCandle;

//     if (timePeriod === "1d") {
//       const newDataPoint = {
//         x: lastCandle.time.valueOf(),
//         y: [
//           parseFloat(lastCandle.open.toFixed(2)),
//           parseFloat(lastCandle.high.toFixed(2)),
//           parseFloat(lastCandle.low.toFixed(2)),
//           parseFloat(lastCandle.close.toFixed(2)),
//         ],
//       };

//       const lastIndex = updatedData[0].data.findIndex((point) =>
//         moment(point.x).isSame(lastCandle.time, "minute")
//       );

//       if (lastIndex !== -1) {
//         updatedData[0].data[lastIndex] = newDataPoint;
//       } else {
//         updatedData[0].data.push(newDataPoint);
//       }

//       // Keep only today's data
//       const startOfDay = currentTime.clone().startOf("day");
//       updatedData[0].data = updatedData[0].data.filter((point) =>
//         moment(point.x).isSameOrAfter(startOfDay)
//       );

//       // Sort data points by timestamp
//       updatedData[0].data.sort((a, b) => a.x - b.x);
//     }

//     return updatedData;
//   };

//   const fetchData = async (timePeriod) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(
//         `http://172.235.16.92:8000/stock_graph/${selectedSymbol}/${timePeriod}/${selectedExchange}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();

//       timeZoneRef.current = data.meta.exchange_timezone;

//       let processedValues = data.values;

//       if (timePeriod === "1d") {
//         const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");
//         processedValues = data.values.filter((item) => {
//           const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
//           console.log("itemDate", itemDate === today);
//           return itemDate === today;
//         });

//         if (processedValues.length > 0) {
//           const lastValue = processedValues[processedValues.length - 1];
//           console.log("lastValue", lastValue);
//           lastCandleRef.current = {
//             time: moment.tz(lastValue.datetime, timeZoneRef.current).startOf("minute"),
//             open: parseFloat(lastValue.open),
//             high: parseFloat(lastValue.high),
//             low: parseFloat(lastValue.low),
//             close: parseFloat(lastValue.close),
//           };
//         }
//       }

//       // console.log("processedValues 222", processedValues);

//       const formattedData = [
//         {
//           name: "Price",
//           data: processedValues
//             .map((item) => ({
//               x: moment.tz(item.datetime, data.meta.exchange_timezone).valueOf(),
//               y: [
//                 parseFloat(item.open),
//                 parseFloat(item.high),
//                 parseFloat(item.low),
//                 parseFloat(item.close),
//               ],
//             }))
//             .filter((item) => !item.y.some((val) => val === null || isNaN(val))),
//         },
//       ];

//       // console.log("formattedData.data", formattedData);

//       const options = {
//         chart: {
//           type: "candlestick",
//           toolbar: {
//             show: false,
//           },
//           animations: {
//             enabled: true,
//             dynamicAnimation: {
//               enabled: true,
//               speed: 350,
//             },
//           },
//         },
//         xaxis: {
//           type: "datetime",
//           labels: {
//             style: {
//               colors: "#c8cfca",
//               fontSize: "10px",
//             },
//             formatter: getDateTimeFormatter(timePeriod, data.meta.exchange_timezone),
//           },
//           tickAmount: timePeriod === "1m" ? 10 : undefined,
//         },
//         yaxis: {
//           tooltip: {
//             enabled: true,
//           },
//           labels: {
//             style: {
//               colors: "#c8cfca",
//               fontSize: "10px",
//             },
//             formatter: (value) => value.toFixed(2),
//           },
//           forceNiceScale: true,
//         },
//         tooltip: {
//           theme: "dark",
//           x: {
//             formatter: getTooltipFormatter(timePeriod, data.meta.exchange_timezone),
//           },
//         },
//         grid: {
//           strokeDashArray: 5,
//           borderColor: "#56577A",
//         },
//         plotOptions: {
//           candlestick: {
//             colors: {
//               upward: "#26C281",
//               downward: "#ed3419",
//             },
//           },
//         },
//       };

//       if (timePeriod === "1d" && processedValues.length === 0) {
//         setError("No data available for today");
//       }

//       setChartData(formattedData);
//       setChartOptions(options);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching the stock data: ", error);
//       setLoading(false);
//       setError(error.message || "Failed to load data");
//     }
//   };

//   useEffect(() => {
//     fetchData(timePeriod);

//     // Clear existing interval if any
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     // Set up interval for 1d view only
//     if (timePeriod === "1d") {
//       intervalRef.current = setInterval(() => {
//         if (timeZoneRef.current) {
//           const currentTime = moment().tz(timeZoneRef.current);
//           setChartData((prevData) => {
//             if (!prevData[0]?.data?.length) return prevData;
//             return updateChartWithNewPrice(prevData, newprice, timeZoneRef.current);
//           });
//         }
//       }, 600); // Update every minute
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [timePeriod, stockData, newprice]);

//   useEffect(() => {
//     if (newprice && timeZoneRef.current && timePeriod === "1d") {
//       const updatedChartData = updateChartWithNewPrice(chartData, newprice, timeZoneRef.current);
//       setChartData(updatedChartData);
//       console.log("updatedChartData", updatedChartData);
//     }
//   }, [newprice]);

//   const handleTimePeriodChange = (newPeriod) => {
//     setTimePeriod(newPeriod);
//   };

//   if (loading) {
//     return (
//       <div className="lds-roller">
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//     );
//   }

//   if (error) {
//     return console.error("Error in Linechart", error);
//   }

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: "20px",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             color: "#fff",
//             fontSize: "12px",
//             gap: "18px",
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <div>High</div>
//             <div style={{ fontWeight: 600, fontSize: "14px" }}>₹ {selectedStocksHigh}</div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div>Low</div>
//             <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {selectedStocksLow}</div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div>Returns</div>
//             <div
//               style={{
//                 color: isPositive ? "#26C281" : "#ed3419",
//                 display: "flex",
//                 alignItems: "center",
//                 fontWeight: 600,
//                 fontSize: "15px",
//               }}
//             >
//               {isPositive ? <FaCaretUp /> : <FaCaretDown />}
//               {Math.abs(selectedStocksChange)?.toFixed(2)}%
//             </div>
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div>Close</div>
//             <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {newprice}</div>
//           </div>
//         </Box>
//         <Box display={"flex"} gap={"15px"}>
//           {["5y", "1y", "1m", "1d"].map((period) => (
//             <button
//               key={period}
//               onClick={() => handleTimePeriodChange(period)}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor: timePeriod === period ? "#0075FF" : "#e0e0e0",
//                 color: timePeriod === period ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               {period.toUpperCase()}
//             </button>
//           ))}
//         </Box>
//       </div>
//       {chartData[0]?.data?.length > 0 ? (
//         <ReactApexChart
//           options={chartOptions}
//           series={chartData}
//           type="candlestick"
//           width="100%"
//           height="100%"
//         />
//       ) : (
//         <div style={{ textAlign: "center", padding: "20px" }}>No data available</div>
//       )}
//     </div>
//   );
// };

// export default LineChart;

const LineChart = ({ newprice }) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1d");
  const stockData = useContext(AuthContext);
  const timeZoneRef = useRef(null);
  const lastPriceRef = useRef(null);

  let selectedSymbol = stockData?.stockData?.symbol;
  let selectedExchange = stockData?.stockData?.exchange;
  const selectedStocksHigh = parseFloat(stockData?.stockData?.high || 0)?.toFixed(2);
  const selectedStocksLow = parseFloat(stockData?.stockData?.low || 0)?.toFixed(2);
  let selectedStocksChange = stockData?.stockData?.percent_change;

  const isPositive = selectedStocksChange >= 0;

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
    if (!currentData[0]?.data?.length || typeof newPrice !== "number") {
      // console.log("typeof newPrice", typeof newPrice);
      // console.log("!currentData[0]?.data?.length", !currentData[0]?.data?.length);
      // console.log("currentDatacurrentData", currentData);
      return currentData;
    }

    const currentTime = moment().tz(timezone);
    const updatedData = [...currentData];

    // Only proceed if the price has changed
    if (lastPriceRef.current !== newPrice) {
      const lastDataPoint = updatedData[0].data[updatedData[0].data.length - 1];

      // Create a new candle
      const newDataPoint = {
        x: currentTime.valueOf(),
        y: [
          lastDataPoint
            ? parseFloat(lastDataPoint.y[3]).toFixed(2)
            : parseFloat(newPrice).toFixed(2), // Open (previous close or current price)
          parseFloat(newPrice).toFixed(2), // High
          parseFloat(newPrice).toFixed(2), // Low
          parseFloat(newPrice).toFixed(2), // Close
        ].map(Number),
      };

      // Add the new candle
      updatedData[0].data.push(newDataPoint);

      // Keep only today's data
      const startOfDay = currentTime.clone().startOf("day");
      updatedData[0].data = updatedData[0].data.filter((point) =>
        moment(point.x).isSameOrAfter(startOfDay)
      );

      lastPriceRef.current = newPrice;
    }

    return updatedData;
  };

  const fetchData = async (timePeriod) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://172.235.16.92:8000/stock_graph/${selectedSymbol}/${timePeriod}/${selectedExchange}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      timeZoneRef.current = data.meta.exchange_timezone;

      let processedValues = data.values;

      if (timePeriod === "1d") {
        const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");
        processedValues = data.values.filter((item) => {
          const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
          return itemDate === today;
        });

        if (processedValues.length > 0) {
          const lastValue = processedValues[processedValues.length - 1];
          lastPriceRef.current = parseFloat(lastValue.close);
        }
      }

      const formattedData = [
        {
          name: "Price",
          data: processedValues
            .map((item) => ({
              x: moment.tz(item.datetime, data.meta.exchange_timezone).valueOf(),
              y: [
                parseFloat(item.open),
                parseFloat(item.high),
                parseFloat(item.low),
                parseFloat(item.close),
              ],
            }))
            .filter((item) => !item.y.some((val) => val === null || isNaN(val))),
        },
      ];

      const options = {
        chart: {
          type: "line",
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              colors: "#c8cfca",
              fontSize: "10px",
            },
            formatter: getDateTimeFormatter(timePeriod, data.meta.exchange_timezone),
          },
          tickAmount: timePeriod === "1m" ? 10 : undefined,
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          labels: {
            style: {
              colors: "#c8cfca",
              fontSize: "10px",
            },
            formatter: (value) => value.toFixed(2),
          },
          forceNiceScale: true,
        },
        tooltip: {
          theme: "dark",
          x: {
            formatter: getTooltipFormatter(timePeriod, data.meta.exchange_timezone),
          },
        },
        grid: {
          strokeDashArray: 5,
          borderColor: "#56577A",
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#26C281",
              downward: "#ed3419",
            },
          },
        },
      };

      if (timePeriod === "1d" && processedValues.length === 0) {
        setError("No data available for today");
      }

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
    fetchData(timePeriod);
  }, [timePeriod, stockData]);

  // useEffect(() => {
  //   if (newprice && timeZoneRef.current && timePeriod === "1d") {
  //     const updatedChartData = updateChartWithNewPrice(chartData, newprice, timeZoneRef.current);
  //     setChartData(updatedChartData);
  //   }
  // }, [newprice]);

  const handleTimePeriodChange = (newPeriod) => {
    setTimePeriod(newPeriod);
  };

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
    return console.error("Error in Linechart", error);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
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
            <div>High</div>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>₹ {selectedStocksHigh}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div>Low</div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {selectedStocksLow}</div>
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
              {" "}
              {newprice ? `₹${newprice}` : ""}
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
      {chartData[0]?.data?.length > 0 ? (
        <ReactApexChart
          options={chartOptions}
          series={chartData}
          type="candlestick"
          width="100%"
          height="100%"
        />
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>No data available</div>
      )}
    </div>
  );
};

export default LineChart;
