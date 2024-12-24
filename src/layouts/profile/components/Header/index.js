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
          py: 2, // Added padding for top and bottom
          mt: 2,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={({ breakpoints }) => ({
            [breakpoints.up("xs")]: {
              gap: "16px",
            },
            [breakpoints.up("sm")]: {
              gap: "0px",
            },
          })}
        >
          <Grid
            item
            xs={12}
            md={1.7}
            lg={1.5}
            xl={1.2}
            xxl={0.8}
            display="flex"
            sx={({ breakpoints }) => ({
              [breakpoints.only("sm")]: {
                justifyContent: "center",
                alignItems: "center",
              },
            })}
          >
            <SoftAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item xs={12} md={4.3} lg={4} xl={3.8} xxl={7}>
            <SoftBox
              height="100%"
              mt={0.5}
              lineHeight={1}
              display="flex"
              flexDirection="column"
              sx={({ breakpoints }) => ({
                [breakpoints.only("sm")]: {
                  justifyContent: "center",
                  alignItems: "center",
                },
              })}
            >
              <SoftTypography
                variant="lg"
                color="black"
                fontWeight="bold"
                sx={{
                  fontSize: "18px", // Adjusted font size
                  fontFamily: "'Roboto', sans-serif", // Applied consistent font-family
                }}
              >
                {username}
              </SoftTypography>
              <SoftTypography
                variant="button"
                color="text"
                fontWeight="regular"
                sx={{
                  fontSize: "14px", // Adjusted font size for email
                  fontFamily: "'Roboto', sans-serif", // Applied consistent font-family
                }}
              >
                {email}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6.5} xl={6} xxl={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{
                  background: "transparent",
                  display: "flex",
                  justifyContent: "flex-end",
                  px: 2, // Added horizontal padding
                }}
              >
                <Tab
                  label="OVERVIEW"
                  icon={<IoCube color="black" size="16px" />}
                  sx={{
                    fontFamily: "'Roboto', sans-serif", // Consistent font-family
                    fontSize: "14px", // Adjusted font size
                    textTransform: "none", // Removed uppercase
                  }}
                />
                <Tab
                  label="TEAMS"
                  icon={<IoDocument color="black" size="16px" />}
                  sx={{
                    fontFamily: "'Roboto', sans-serif", // Consistent font-family
                    fontSize: "14px", // Adjusted font size
                    textTransform: "none", // Removed uppercase
                  }}
                />
                <Tab
                  label="PROJECTS"
                  icon={<IoBuild color="black" size="16px" />}
                  sx={{
                    fontFamily: "'Roboto', sans-serif", // Consistent font-family
                    fontSize: "14px", // Adjusted font size
                    textTransform: "none", // Removed uppercase
                  }}
                />
              </Tabs>
            </AppBar>
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
