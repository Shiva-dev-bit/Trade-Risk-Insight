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
import Divider from "@mui/material/Divider";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

function Separator() {
  return (
    <VuiBox position="relative" py={0.25}>
      <Divider />
      <VuiBox
        bgColor="white"
        position="absolute"
        top="50%"
        left="50%"
        px={1.5}
        lineHeight={1}
        sx={{ transform: "translate(-50%, -60%)" }}
      >
        <VuiTypography variant="button" fontWeight="medium" color="text">
          or
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

export default Separator;
