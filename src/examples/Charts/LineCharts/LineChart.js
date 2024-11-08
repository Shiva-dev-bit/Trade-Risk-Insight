import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment-timezone";
import { AuthContext } from "context/Authcontext";
import { Box } from "@mui/material";
import { FaArrowDown, FaArrowUp, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { supabase } from "lib/supabase";

const LineChart = ({ newprice }) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1d");
  const stockData = useContext(AuthContext);

  let selectedSymbol = stockData?.stockData?.symbol;
  let selectedExchange = stockData?.stockData?.exchange;
  const selectedStocksHigh = parseFloat(stockData?.stockData?.high || 0).toFixed(2);
  const selectedStocksLow = parseFloat(stockData?.stockData?.low || 0).toFixed(2);
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
        return (value) => moment.tz(value, timezone).format("HH:mm");
      // case "1m":
      //   return (value) => moment.tz(value, timezone).format("DD MMM HH:mm");
      default:
        return (value) => moment.tz(value, timezone).format("DD MMM YYYY");
    }
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

      // Filter and process data based on time period
      let processedValues = data.values;

      if (timePeriod === "1d") {
        const today = moment().tz(data.meta.exchange_timezone).format("YYYY-MM-DD");
        processedValues = data.values.filter((item) => {
          const itemDate = moment
            .tz(item.datetime, data.meta.exchange_timezone)
            .format("YYYY-MM-DD");
          return itemDate === today;
        });
      } else if (timePeriod === "1m") {
        // Sort data by datetime
        processedValues.sort((a, b) => moment(a.datetime).valueOf() - moment(b.datetime).valueOf());

        // Get first and last dates
        const firstDate = moment(processedValues[0]?.datetime);
        const lastDate = moment(processedValues[processedValues.length - 1]?.datetime);

        // Create a map of existing dates for quick lookup
        const existingDates = new Map(
          processedValues.map((item) => [moment(item.datetime).format("YYYY-MM-DD"), item])
        );

        // Fill in missing dates
        const filledValues = [];
        const currentDate = firstDate.clone();
        while (currentDate.isSameOrBefore(lastDate, "day")) {
          const dateStr = currentDate.format("YYYY-MM-DD");
          const existingData = existingDates.get(dateStr);

          if (existingData) {
            filledValues.push(existingData);
          } else {
            // Only add null data for weekdays (Monday-Friday)
            if (currentDate.day() !== 0 && currentDate.day() !== 6) {
              const previousValue = filledValues[filledValues.length - 1];
              filledValues.push({
                datetime: dateStr + "T00:00:00",
                open: previousValue?.close || null,
                high: previousValue?.close || null,
                low: previousValue?.close || null,
                close: previousValue?.close || null,
                volume: "0",
              });
            }
          }
          currentDate.add(1, "day");
        }
        processedValues = filledValues;
      }

      if (timePeriod === "1m") {
        // Sort data by datetime
        processedValues.sort((a, b) => moment(a.datetime).valueOf() - moment(b.datetime).valueOf());

        // Remove weekends or dates without data to avoid gaps
        processedValues = processedValues.filter((item) => {
          const day = moment(item.datetime).day();
          return day !== 0 && day !== 6; // Exclude weekends
        });
      }

      const formattedData = [
        {
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
          type: "candlestick",
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              colors: "#c8cfca",
              fontSize: "10px",
            },
            datetimeFormatter: {
              hour: "HH:mm",
              minute: "HH:mm",
              day: "DD MMM",
              month: "MMM 'YY",
              year: "YYYY",
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
    // return <div style={{ color: "#ff0000", textAlign: "center", padding: "20px" }}>{error}</div>;
    return console.error("Error in Linechart", error);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            color: "#fff",
            fontSize: "13px",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div>High</div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {selectedStocksHigh}</div>
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
              {Math.abs(selectedStocksChange).toFixed(2)}%
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

// import React, { useState, useEffect, useContext, useRef } from "react";
// import ReactApexChart from "react-apexcharts";
// import moment from "moment-timezone";
// import { AuthContext } from "context/Authcontext";
// import { Box } from "@mui/material";
// import { FaArrowDown, FaArrowUp, FaCaretDown, FaCaretUp } from "react-icons/fa";
// import { supabase } from "lib/supabase";

// const LineChart = ({ newprice }) => {
//   const [chartData, setChartData] = useState([]);
//   const [chartOptions, setChartOptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timePeriod, setTimePeriod] = useState("1d");
//   const stockData = useContext(AuthContext);
//   const lastDataRef = useRef({
//     timezone: null,
//     lastCandle: null,
//   });
//   const timeZoneRef = useRef(null);
//   const lastCandleRef = useRef(null);

//   let selectedSymbol = stockData?.stockData?.symbol;
//   let selectedExchange = stockData?.stockData?.exchange;
//   const selectedStocksHigh = parseFloat(stockData?.stockData?.high || 0).toFixed(2);
//   const selectedStocksLow = parseFloat(stockData?.stockData?.low || 0).toFixed(2);
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

//   // const updateChartWithNewPrice = (currentData, newPrice, timezone) => {
//   //   if (!currentData[0]?.data?.length || !newPrice) return currentData;

//   //   const currentTime = moment().tz(timezone);
//   //   const updatedData = [...currentData];
//   //   const currentMinute = currentTime.startOf("minute");

//   //   if (!lastDataRef.current.lastCandle) {
//   //     // Initialize the first candle of the session
//   //     lastDataRef.current.lastCandle = {
//   //       time: currentMinute,
//   //       open: newPrice,
//   //       high: newPrice,
//   //       low: newPrice,
//   //       close: newPrice,
//   //     };
//   //   }

//   //   // Update or create new candle
//   //   if (currentMinute.isSame(lastDataRef.current.lastCandle.time)) {
//   //     // Update existing candle
//   //     lastDataRef.current.lastCandle.high = Math.max(lastDataRef.current.lastCandle.high, newPrice);
//   //     lastDataRef.current.lastCandle.low = Math.min(lastDataRef.current.lastCandle.low, newPrice);
//   //     lastDataRef.current.lastCandle.close = newPrice;
//   //   } else {
//   //     // Create new candle
//   //     const newCandle = {
//   //       time: currentMinute,
//   //       open: lastDataRef.current.lastCandle.close, // Previous close becomes new open
//   //       high: newPrice,
//   //       low: newPrice,
//   //       close: newPrice,
//   //     };
//   //     lastDataRef.current.lastCandle = newCandle;
//   //   }

//   //   // Only update if we're viewing the 1d chart
//   //   if (timePeriod === "1d") {
//   //     const newDataPoint = {
//   //       x: lastDataRef.current.lastCandle.time.valueOf(),
//   //       y: [
//   //         lastDataRef.current.lastCandle.open,
//   //         lastDataRef.current.lastCandle.high,
//   //         lastDataRef.current.lastCandle.low,
//   //         lastDataRef.current.lastCandle.close,
//   //       ],
//   //     };

//   //     // Find and update or add the candle
//   //     const lastIndex = updatedData[0].data.findIndex((point) =>
//   //       moment(point.x).isSame(lastDataRef.current.lastCandle.time, "minute")
//   //     );

//   //     if (lastIndex !== -1) {
//   //       updatedData[0].data[lastIndex] = newDataPoint;
//   //     } else {
//   //       updatedData[0].data.push(newDataPoint);
//   //     }

//   //     // Keep only today's data
//   //     const startOfDay = currentTime.clone().startOf("day");
//   //     updatedData[0].data = updatedData[0].data.filter((point) =>
//   //       moment(point.x).isSameOrAfter(startOfDay)
//   //     );
//   //   }

//   //   return updatedData;
//   // };

//   const updateChartWithNewPrice = (currentData, newPrice, timezone) => {
//     if (!currentData[0]?.data?.length || !newPrice) return currentData;

//     const currentTime = moment().tz(timezone);
//     const updatedData = [...currentData];
//     const currentMinute = currentTime.startOf("minute");

//     // Get the last candle data
//     let lastCandle = lastCandleRef.current;

//     if (!lastCandle) {
//       // Initialize the first candle of the session
//       lastCandle = {
//         time: currentMinute,
//         open: newPrice,
//         high: newPrice,
//         low: newPrice,
//         close: newPrice,
//       };
//     }

//     // Update or create new candle
//     if (currentMinute.isSame(lastCandle.time)) {
//       // Update existing candle
//       lastCandle.high = Math.max(lastCandle.high, newPrice);
//       lastCandle.low = Math.min(lastCandle.low, newPrice);
//       lastCandle.close = newPrice;
//     } else {
//       // Create new candle
//       lastCandle = {
//         time: currentMinute,
//         open: lastCandle.close, // Previous close becomes new open
//         high: newPrice,
//         low: newPrice,
//         close: newPrice,
//       };
//     }

//     // Store the updated lastCandle
//     lastCandleRef.current = lastCandle;

//     // Only update if we're viewing the 1d chart
//     if (timePeriod === "1d") {
//       const newDataPoint = {
//         x: lastCandle.time.valueOf(),
//         y: [lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close],
//       };

//       // Find and update or add the candle
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

//       // Store the timezone
//       timeZoneRef.current = data.meta.exchange_timezone;

//       let processedValues = data.values;

//       if (timePeriod === "1d") {
//         const today = moment().tz(timeZoneRef.current).format("YYYY-MM-DD");
//         processedValues = data.values.filter((item) => {
//           const itemDate = moment.tz(item.datetime, timeZoneRef.current).format("YYYY-MM-DD");
//           return itemDate === today;
//         });

//         // Set the last candle reference for real-time updates
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
//       } else if (timePeriod === "1m") {
//         // Existing monthly data processing...
//         processedValues.sort((a, b) => moment(a.datetime).valueOf() - moment(b.datetime).valueOf());
//         const firstDate = moment(processedValues[0]?.datetime);
//         const lastDate = moment(processedValues[processedValues.length - 1]?.datetime);
//         const existingDates = new Map(
//           processedValues.map((item) => [moment(item.datetime).format("YYYY-MM-DD"), item])
//         );

//         const filledValues = [];
//         const currentDate = firstDate.clone();
//         while (currentDate.isSameOrBefore(lastDate, "day")) {
//           const dateStr = currentDate.format("YYYY-MM-DD");
//           const existingData = existingDates.get(dateStr);

//           if (existingData) {
//             filledValues.push(existingData);
//           } else {
//             if (currentDate.day() !== 0 && currentDate.day() !== 6) {
//               const previousValue = filledValues[filledValues.length - 1];
//               filledValues.push({
//                 datetime: dateStr + "T00:00:00",
//                 open: previousValue?.close || null,
//                 high: previousValue?.close || null,
//                 low: previousValue?.close || null,
//                 close: previousValue?.close || null,
//                 volume: "0",
//               });
//             }
//           }
//           currentDate.add(1, "day");
//         }
//         processedValues = filledValues.filter((item) => {
//           const day = moment(item.datetime).day();
//           return day !== 0 && day !== 6;
//         });
//       }

//       const formattedData = [
//         {
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
//             datetimeFormatter: {
//               hour: "HH:mm",
//               minute: "HH:mm",
//               day: "DD MMM",
//               month: "MMM 'YY",
//               year: "YYYY",
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

//       lastDataRef.current.timezone = data.meta.exchange_timezone;
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

//   // Effect for handling real-time price updates
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
//           gap: "20px",
//           marginBottom: "20px",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             color: "#fff",
//             fontSize: "13px",
//             gap: "20px",
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <div>High</div>
//             <div style={{ fontWeight: 600, fontSize: "15px" }}>₹ {selectedStocksHigh}</div>
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
//               {Math.abs(selectedStocksChange).toFixed(2)}%
//             </div>
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
