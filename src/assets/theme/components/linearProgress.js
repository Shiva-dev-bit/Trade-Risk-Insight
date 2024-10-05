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
import borders from "assets/theme/base/borders";
import colors from "assets/theme/base/colors";

// UI Risk LENS AI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { borderRadius } = borders;
const { light } = colors;

export default {
  styleOverrides: {
    root: {
      height: pxToRem(3),
      borderRadius: borderRadius.md,
      overflow: "visible",
      position: "relative",
    },

    colorPrimary: {
      backgroundColor: light.main,
    },

    colorSecondary: {
      backgroundColor: light.main,
    },

    bar: {
      height: pxToRem(6),
      borderRadius: borderRadius.sm,
      position: "absolute",
      transform: `translate(0, ${pxToRem(-1.5)}) !important`,
      transition: "width 0.6s ease !important",
    },
  },
};
