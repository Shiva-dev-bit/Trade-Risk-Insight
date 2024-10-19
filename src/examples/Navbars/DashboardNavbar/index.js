import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";

// UI Risk LENS AI Dashboard React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// UI Risk LENS AI Dashboard React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import { Box, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { supabase } from "lib/supabase";

function DashboardNavbar({ absolute, light, isMini, handleClickStock }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchSearchData = async (query) => {
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .or(`company_name.ilike.%${query}%,symbol.ilike.%${query}%`);

      console.log("fetchSearchData data's", data);
      if (error) throw error;
      setFilteredData(data || []); // Set only the relevant data
    } catch (error) {
      console.error("Error fetching data:", error);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchSearchData(searchTerm);
      } else {
        setFilteredData([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [
    dispatch,
    fixedNavbar,
    // searchTerm
  ]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="text"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            payment
          </Icon>
        }
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <VuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </VuiBox>
        {isMini ? null : (
          <VuiBox sx={(theme) => navbarRow(theme, { isMini })}>
            <VuiBox pr={1}>
              <Box
                sx={({ breakpoints }) => ({
                  backgroundColor: "info.main !important",
                  width: "300px",
                  position: "relative",
                  [breakpoints.down("sm")]: { maxWidth: "80px" },
                })}
              >
                {/* Search Input */}
                <VuiInput
                  type="search"
                  size="large"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={{
                    component: (
                      <span role="img" aria-label="search">
                        🔍
                      </span>
                    ),
                    direction: "left",
                  }}
                  sx={({ breakpoints }) => ({
                    [breakpoints.down("sm")]: {
                      maxWidth: "80px",
                    },
                    [breakpoints.only("sm")]: {
                      maxWidth: "80px",
                    },
                    // width: "100%",
                    // [breakpoints.down("sm")]: { maxWidth: "80%" },
                    backgroundColor: "white !important",
                  })}
                />

                {/* Search Results */}
                {searchTerm && (
                  <List
                    sx={{
                      marginTop: 2,
                      backgroundColor: "#012654",
                      borderRadius: 2,
                      position: "absolute",
                      width: "35rem",
                      height: "20rem",
                      zIndex: 10,
                      left: "-50%",
                      overflow: "scroll",
                    }}
                  >
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <Box
                          key={`${item.symbol}-${index}`}
                          sx={{ p: 1, color: "white !important", fontSize: "16px" }}
                        >
                          <Box
                            sx={{ cursor: "pointer", borderBottom: "1px solid white", pb: 2 }}
                            onClick={() => {
                              handleClickStock(item);
                            }}
                          >
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", gap: "5rem" }}
                            >
                              <Box sx={{ fontWeight: 900 }}>{item.company_name}</Box>
                              <Box>{item.exchange}</Box>
                            </Box>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", gap: "5rem" }}
                            >
                              <Box
                                sx={{ background: "grey", padding: "0.4rem", borderRadius: "10px" }}
                              >
                                {item.symbol}
                              </Box>
                              <Box>{item.mic_code}</Box>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ padding: 2, textAlign: "center", color: "gray" }}>
                        No results found.
                      </Typography>
                    )}
                  </List>
                )}
              </Box>
            </VuiBox>
            <VuiBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in">
                <IconButton sx={navbarIconButton} size="small">
                  <Icon
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  >
                    account_circle
                  </Icon>
                  <VuiTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                  >
                    Sign in
                  </VuiTypography>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={"text-white"}>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </VuiBox>
          </VuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  // handleClickStock : ()=>void
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
