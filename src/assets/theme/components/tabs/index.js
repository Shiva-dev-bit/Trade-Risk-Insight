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

// UI Risk LENS AI Dashboard React base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// UI Risk LENS AI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { grey, info } = colors;
const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      position: "relative",
      backgroundColor: grey[100],
      borderRadius: borderRadius.md,
      minHeight: "unset",
      padding: pxToRem(4),
    },

    flexContainer: {
      height: "100%",
      position: "relative",
      zIndex: 10,
    },

    fixed: {
      overflow: "unset !important",
      overflowX: "unset !important",
    },

    vertical: {
      "& .MuiTabs-indicator": {
        width: "100%",
      },
    },

    indicator: {
      height: "100%",
      borderRadius: borderRadius.lg,
      backgroundColor: info.main,
      transition: "all 500ms ease",
    },
  },
};
