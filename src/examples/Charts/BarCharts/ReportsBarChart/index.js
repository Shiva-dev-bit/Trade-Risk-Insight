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

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ReportsBarChart = ({ barChartData, barChartOptions }) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  console.log('BarChart',chartData);

  useEffect(() => {
    setChartData(barChartData);
    setChartOptions(barChartOptions);
  }, [barChartData, barChartOptions]);

  if (!chartData.length || !Object.keys(chartOptions).length) {
    return <div>Loading...</div>;
  }

  return <Chart options={chartOptions} series={chartData} type="bar" width="100%" height="100%" />;
};


// Setting default values for the props of ReportsBarChart
ReportsBarChart.defaultProps = {
  barChartOptions : {},
  barChartData : []
};

// Typechecking props for the ReportsBarChart
ReportsBarChart.propTypes = {
  barChartData: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  barChartOptions: PropTypes.objectOf(PropTypes.object),
};

export default ReportsBarChart;
