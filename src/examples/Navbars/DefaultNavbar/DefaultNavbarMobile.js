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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Menu from "@mui/material/Menu";
// import Grid from "@mui/material/Grid";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";

// UI Risk LENS AI Dashboard React example components
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import palette from "assets/theme/base/colors";
import tripleLinearGradient from "assets/theme/functions/tripleLinearGradient";

function DefaultNavbarMobile({ open, close }) {
  const { width } = open && open.getBoundingClientRect();

  return (
    <Menu
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      sx={{
        marginTop: "8px",
      }}
      MenuListProps={{
        style: {
          width: `calc(${width}px - 4rem)`,
          backgroundImage: tripleLinearGradient(
            palette.gradients.cover.main,
            palette.gradients.cover.state,
            palette.gradients.cover.stateSecondary,
            palette.gradients.cover.deg
          ),
          backgroundColor: "unset !important",
          padding: "8px",
        },
      }}
    >
      <VuiBox px={0.5}>
        <DefaultNavbarLink icon="donut_large" name="dashboard" route="/dashboard" />
        <DefaultNavbarLink icon="person" name="profile" route="/profile" />
        <DefaultNavbarLink icon="account_circle" name="sign up" route="/authentication/sign-up" />
        <DefaultNavbarLink icon="key" name="sign in" route="/authentication/sign-in" />
      </VuiBox>
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
