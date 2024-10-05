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

// @mui material components
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

export default styled(Switch)(({ theme, ownerState }) => {
  const { palette } = theme;
  const { color } = ownerState;
  const { white, secondary } = palette;

  // styles for the button with variant="contained"
  const containedStyles = () => {
    // background color value
    const backgroundValue = palette[color] ? palette[color].main : white.main;

    // color value when button is focused

    return {
      "&.MuiSwitch-root": {
        "& .MuiSwitch-thumb": {
          backgroundColor: white.main,
        },
        "& .MuiSwitch-track": {
          backgroundColor: `${secondary.main} !important`,
          borderColor: "transparent",
        },
        "& .Mui-checked+.MuiSwitch-track": {
          backgroundColor: `${backgroundValue} !important`,
        },
      },
    };
  };

  return {
    ...containedStyles(),
  };
});
