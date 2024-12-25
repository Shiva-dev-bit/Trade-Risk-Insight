import AppBar from "@mui/material/AppBar";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
// Images
import burceMars from "assets/images/image.png";
// UI Risk LENS AI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";
import SoftAvatar from "components/SoftAvatar";
// UI Risk LENS AI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
// UI Risk LENS AI Dashboard React icons
import { IoCube } from "react-icons/io5";
import { IoDocument } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
// UI Risk LENS AI Dashboard React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Header({ username, email }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.lg
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <SoftBox position="relative">
      <Card
        sx={{
          px: 3,
          py: 2,
          mt: 2
        }}
      >
        <Grid
          container
          alignItems="center"
          sx={{ gap: '16px' }}
        >
          {/* Avatar Grid */}
          <Grid item>
            <SoftAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>

          {/* Text Content Grid */}
          <Grid item>
            <SoftBox
              height="100%"
              lineHeight={1}
              display="flex"
              flexDirection="column"
            >
              <SoftTypography
                variant="lg"
                color="black"
                fontWeight="bold"
                sx={{
                  fontSize: "18px",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {username}
              </SoftTypography>
              <SoftTypography
                variant="button"
                color="text"
                fontWeight="regular"
                sx={{
                  fontSize: "14px",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {email}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>

  );
}
Header.propTypes = {
  user: PropTypes.object.isRequired,
};

Header.propTypes = {
  username: PropTypes.string,
  email: PropTypes.string,
};

export default Header;
