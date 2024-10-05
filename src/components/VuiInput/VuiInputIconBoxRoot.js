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

import { styled } from "@mui/material/styles";

export default styled("div")(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { size } = ownerState;

  const { dark } = palette;
  const { pxToRem } = functions;

  return {
    lineHeight: 0,
    padding: size === "small" ? `${pxToRem(4)} ${pxToRem(10)}` : `${pxToRem(8)} ${pxToRem(10)}`,
    width: pxToRem(39),
    height: "100%",
    color: dark.main,
  };
});
