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

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for the VuiBadge
import VuiBadgeRoot from "components/VuiBadge/VuiBadgeRoot";

const VuiBadge = forwardRef(
  ({ color, variant, size, circular, indicator, border, container, children, ...rest }, ref) => (
    <VuiBadgeRoot
      {...rest}
      ownerState={{ color, variant, size, circular, indicator, border, container, children }}
      ref={ref}
      color="default"
    >
      {children}
    </VuiBadgeRoot>
  )
);

// Setting default values for the props of VuiBadge
VuiBadge.defaultProps = {
  color: "info",
  variant: "gradient",
  size: "sm",
  circular: false,
  indicator: false,
  border: false,
  children: false,
  container: false,
};

// Typechecking props of the VuiBadge
VuiBadge.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  variant: PropTypes.oneOf(["gradient", "contained", "standard"]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  circular: PropTypes.bool,
  indicator: PropTypes.bool,
  border: PropTypes.bool,
  children: PropTypes.node,
  container: PropTypes.bool,
};

export default VuiBadge;
