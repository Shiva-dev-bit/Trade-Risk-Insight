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
import boxShadows from "assets/theme/base/boxShadows";
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import linearGradient from "assets/theme/functions/linearGradient";

// UI Risk LENS AI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { borderWidth } = borders;
const { lg } = boxShadows;
const { size } = typography;
const { white, borderCol, gradients, transparent } = colors;
const { borderRadius } = borders;

export default {
  defaultProps: {
    disableAutoFocusItem: true,
  },

  styleOverrides: {
    "& .MuiIcon-root": {
      stroke: white.main,
    },
    paper: {
      minWidth: pxToRem(160),
      boxShadow: lg,
      padding: `0 !important`,
      fontSize: size.sm,
      color: white.main,
      textAlign: "left",
      border: `${borderWidth[1]} solid ${borderCol.navbar}`,
      borderRadius: borderRadius.md,
    },
    list: {
      background: linearGradient(gradients.menu.main, gradients.menu.state, gradients.menu.deg),
      "& .MuiMenuItem-root": {
        "& .MuiBox-root .MuiTypography-root": {
          color: white.main,
        },
        "&:hover": {
          background: transparent.main,
        },
      },
    },
  },
};
