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

/**
  The gradientChartLine() function helps you to create a gradient color for the chart line
 */

// UI Risk LENS AI Dashboard React helper functions
import rgba from "assets/theme/functions/rgba";

function gradientChartLine(chart, color, opacity = 0.2) {
  const ctx = chart.getContext("2d");
  const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
  const primaryColor = rgba(color, opacity).toString();

  gradientStroke.addColorStop(1, primaryColor);
  gradientStroke.addColorStop(0.2, "rgba(72, 72, 176, 0.0)");
  gradientStroke.addColorStop(0, "rgba(203, 12, 159, 0)");

  return gradientStroke;
}

export default gradientChartLine;
