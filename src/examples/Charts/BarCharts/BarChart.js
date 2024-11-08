import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ barChartData, barChartOptions }) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData(barChartData);
    setChartOptions(barChartOptions);
  }, [barChartData, barChartOptions]);

  if (!chartData.length || !Object.keys(chartOptions).length) {
    return <div>Loading...</div>;
  }

  return <Chart options={chartOptions} series={chartData} type="bar" width="100%" height="100%" />;
};

export default BarChart;
