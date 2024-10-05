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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Timeline context
import { TimelineProvider } from "examples/Timeline/context";

function TimelineList({ title, dark, children }) {
  return (
    <TimelineProvider value={dark}>
      <Card>
        <VuiBox bgColor={dark ? "dark" : "white"} variant="gradient">
          <VuiBox pt={3} px={3}>
            <VuiTypography variant="h6" fontWeight="medium" color={dark ? "white" : "dark"}>
              {title}
            </VuiTypography>
          </VuiBox>
          <VuiBox p={2}>{children}</VuiBox>
        </VuiBox>
      </Card>
    </TimelineProvider>
  );
}

// Setting default values for the props of TimelineList
TimelineList.defaultProps = {
  dark: false,
};

// Typechecking props for the TimelineList
TimelineList.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TimelineList;
