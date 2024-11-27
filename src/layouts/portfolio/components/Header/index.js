import AppBar from "@mui/material/AppBar";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
// Images
import burceMars from "assets/images/avatar-simmmple.png";
// UI Risk LENS AI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";
import VuiAvatar from "components/VuiAvatar";
// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
// UI Risk LENS AI Dashboard React icons
import { IoCube } from "react-icons/io5";
import { IoDocument } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
// UI Risk LENS AI Dashboard React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

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
<Box position="relative">
  <Card
    sx={{
      px: 3,
      mt: 2,
    }}
  >
    <Grid
      container
      alignItems="center"
      justifyContent="space-between" // Ensure proper spacing
      sx={({ breakpoints }) => ({
        gap: "16px",
        [breakpoints.up("sm")]: {
          gap: "8px",
        },
      })}
    >
      {/* Avatar and Username Section - 30% */}
      <Grid
        item
        xs={12}
        sm={4}
        md={4}
        lg={4}
        xl={4}
        xxl={3.5}
        display="flex"
        alignItems="center"
        sx={({ breakpoints }) => ({
          [breakpoints.only("sm")]: {
            justifyContent: "flex-start",
          },
        })}
      >
        {/* Avatar */}
        <VuiAvatar
          src={burceMars}
          alt="profile-image"
          variant="rounded"
          size="xl"
          shadow="sm"
          sx={{ marginRight: 2 }} // Add space between avatar and text
        />
        {/* Username and Email */}
        <VuiBox
          height="100%"
          lineHeight={1}
          display="flex"
          flexDirection="column"
        >
          <VuiTypography variant="lg" color="white" fontWeight="bold">
            {username && username}
          </VuiTypography>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {email}
          </VuiTypography>
        </VuiBox>
      </Grid>

      {/* Tabs Section - 70% */}
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        lg={8}
        xl={8}
        xxl={8.5}
        sx={{
          display: "flex",
          justifyContent: "flex-start", // Align tabs to the left
        }}
      >
        <AppBar position="static" sx={{ boxShadow: "none", background: "transparent" }}>
          <Tabs
            orientation="horizontal"
            value={tabValue}
            onChange={handleSetTabValue}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              background: "transparent",
              "& .MuiTab-root": {
                minWidth: "120px", // Ensure consistent tab size
              },
            }}
          >
            <Tab label="Total Investment" icon={<IoCube color="white" size="16px" />} />
            <Tab label="Total Current Value" icon={<IoDocument color="white" size="16px" />} />
            <Tab label="Total Profit/Loss" icon={<IoBuild color="white" size="16px" />} />
            <Tab label="Annualised Return" icon={<IoBuild color="white" size="16px" />} />
            <Tab label="Daily Change" icon={<IoBuild color="white" size="16px" />} />
          </Tabs>
        </AppBar>
      </Grid>
    </Grid>
  </Card>
</Box>


  );
}

export default Header;
