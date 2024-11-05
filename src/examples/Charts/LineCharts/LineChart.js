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

// import React from "react";
// import ReactApexChart from "react-apexcharts";

// class LineChart extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       chartData: [],
//       chartOptions: {},
//       loading: true,
//       error: null,
//       timePeriod: "1d", // default time period
//     };
//   }

//   componentDidMount() {
//     this.fetchData(this.state.timePeriod);
//   }

//   // Fetch data based on the selected time period
//   async fetchData(timePeriod) {
//     try {
//       this.setState({ loading: true, error: null }); // reset loading state

//       const response = await fetch(
//         `https://8fc9-223-178-85-213.ngrok-free.app/stock_graph/TCS/${timePeriod}/NSE`
//       );
//       const data = await response.json();

//       // Prepare data for the candlestick chart
//       const chartData = [
//         {
//           name: "TCS Stock Price",
//           data: data.values.map((item) => ({
//             x: item.datetime,
//             y: [
//               parseFloat(item.open),
//               parseFloat(item.high),
//               parseFloat(item.low),
//               parseFloat(item.close),
//             ],
//           })),
//         },
//       ];

//       const chartOptions = {
//         chart: {
//           type: "candlestick",
//           toolbar: {
//             show: false,
//           },
//         },
//         xaxis: {
//           type: "datetime",
//           labels: {
//             style: {
//               colors: "#c8cfca",
//               fontSize: "10px",
//             },
//           },
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
//           },
//         },
//         tooltip: {
//           theme: "dark",
//         },
//         grid: {
//           strokeDashArray: 5,
//           borderColor: "#56577A",
//         },
//       };

//       this.setState({
//         chartData,
//         chartOptions,
//         loading: false,
//       });
//     } catch (error) {
//       console.error("Error fetching the stock data: ", error);
//       this.setState({ loading: false, error: "Failed to load data" });
//     }
//   }

//   // Handle time period change
//   handleTimePeriodChange = (newPeriod) => {
//     this.setState({ timePeriod: newPeriod }, () => {
//       this.fetchData(newPeriod);
//     });
//   };

//   render() {
//     const { chartData, chartOptions, loading, error, timePeriod } = this.state;

//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (error) {
//       return <div>{error}</div>;
//     }

//     return (
//       <div>
//         {/* Time Period Buttons */}
//         <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//           {["5y", "1y", "1m", "1d"].map((period) => (
//             <button
//               key={period}
//               onClick={() => this.handleTimePeriodChange(period)}
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
//         </div>

//         {/* Candlestick Chart */}
//         <ReactApexChart
//           options={chartOptions}
//           series={chartData}
//           type="candlestick"
//           width="100%"
//           height="100%"
//         />
//       </div>
//     );
//   }
// }

// export default LineChart;

import { AuthContext } from "context/Authcontext";
import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import "./chartLoader.css";

const LineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1m"); // default time period

  const stockData = useContext(AuthContext);
  let selectedSymbol = stockData?.stockData?.symbol;
  let selectedExchange = stockData?.stockData?.exchange;

  const fetchData = async (timePeriod) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://8fc9-223-178-85-213.ngrok-free.app/stock_graph/${selectedSymbol}/${timePeriod}/${selectedExchange}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const formattedData = [
        {
          // name: "TCS Stock Price",
          data: data.values.map((item) => ({
            x: item.datetime,
            y: [
              parseFloat(item.open),
              parseFloat(item.high),
              parseFloat(item.low),
              parseFloat(item.close),
            ],
          })),
        },
      ];

      const options = {
        chart: {
          type: "candlestick",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              colors: "#c8cfca",
              fontSize: "10px",
            },
          },
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
          },
        },
        tooltip: {
          theme: "dark",
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

  // Fetch data when component mounts or timePeriod changes
  useEffect(() => {
    fetchData(timePeriod);
  }, [timePeriod, stockData]);

  // Handle time period change
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
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Time Period Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
      </div>

      {/* Candlestick Chart */}
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="candlestick"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default LineChart;
