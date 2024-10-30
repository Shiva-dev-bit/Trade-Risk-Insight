import { useState, useEffect, useContext } from "react";
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
import { Box, Checkbox, FormControlLabel, FormGroup, List, ListItemIcon, MenuItem, Typography } from "@mui/material";
import { supabase } from "lib/supabase";
import { BsChevronDown } from "react-icons/bs";
import StockPrice from "./StockPrice";
import axios from "axios";
import { AuthContext } from "context/Authcontext";
import { Logout } from "@mui/icons-material";

function DashboardNavbar({ absolute, light, isMini, handleClickStock }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [user, setUser] = useState([]);



  const { session } = useContext(AuthContext);

  const userEmail = session?.user?.email;

  console.log('user', user);


  const fetchUser = async (userMail) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("email", userMail);

      if (error) throw error;
      if (data) setUser(data);
    } catch (error) {
      console.log('Error fetching stocks:', error);
    }
  };

  useEffect(() => {
    fetchUser(userEmail);
  }, [userEmail])



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
  }, [dispatch, fixedNavbar]);

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

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isDefaultActive, setIsDefaultActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    countries: [],
    exchanges: [],
    currencies: [],
    types: [],
  });

  const filterCategories = {
    countries: { label: "Countries", key: "country" },
    exchanges: { label: "Exchanges", key: "exchange" },
    currencies: { label: "Currencies", key: "currency" },
    types: { label: "Financial Assets Types", key: "type" },
  };

  const normalizeStockData = (data, source) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      company_name: item.company_name || "",
      symbol: item.symbol || "",
      exchange: item.exchange || "",
      currency: item.currency || "",
      country: item.country || "",
      type: item.type || "",
      mic_code: item.mic_code || "",
      price: source === "api" ? item.price : "",
      close: source === "api" ? item.close : "",
      percent_change: source === "api" ? item.percent_change : "",
      source,
    }));
  };

  const removeDuplicates = (apiData, supabaseData) => {
    const seen = new Set();
    const combined = [...supabaseData];

    apiData.forEach((apiItem) => {
      const key = `${apiItem.symbol}-${apiItem.exchange}`;
      if (!seen.has(key)) {
        const existsInSupabase = supabaseData.some(
          (dbItem) => dbItem.symbol === apiItem.symbol && dbItem.exchange === apiItem.exchange
        );
        if (!existsInSupabase) {
          combined.push(apiItem);
        }
      }
      seen.add(key);
    });

    return combined;
  };

  const fetchSupabaseData = async (query) => {
    if (!query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .or(`company_name.ilike.%${query}%,symbol.ilike.%${query}%`);

      if (error) throw error;
      return normalizeStockData(data || [], "supabase");
    } catch (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }
  };

  const fetchApiData = async (query) => {
    if (!query.trim()) return [];

    try {
      const response = await axios.get(
        `https://4fdf-223-178-80-57.ngrok-free.app/search/${query}`,
        { headers: { Accept: "application/json" } }
      );

      if (response.headers["content-type"]?.includes("application/json")) {
        console.log("response", response.data);
        return normalizeStockData(response.data || [], "api");
      } else {
        console.error("Unexpected content type:", response.data);
        return [];
      }
    } catch (error) {
      console.error("API fetch error:", error.message);
      return [];
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setShowDropdown(true);

    if (!value.trim()) {
      setFilteredData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let results = [];

      if (!isDefaultActive) {
        // Fetch from both sources when advance search is not active
        const [supabaseData, apiData] = await Promise.all([
          fetchSupabaseData(value),
          fetchApiData(value),
        ]);
        results = removeDuplicates(apiData, supabaseData);
      } else {
        // Only fetch from Supabase when advance search is active
        results = await fetchSupabaseData(value);
      }

      // Apply filters
      Object.entries(selectedFilters).forEach(([category, selectedValues]) => {
        if (selectedValues.length > 0) {
          const key = filterCategories[category].key;
          results = results.filter((item) => selectedValues.includes(item[key]));
        }
      });

      setFilteredData(
        results.sort((a, b) => (a.company_name || "").localeCompare(b.company_name || ""))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedFilters, isDefaultActive]);

  const getUniqueValues = (data, key) => {
    return [...new Set(data.map((item) => item[key]).filter(Boolean))].sort();
  };

  const getCounts = (data, key) => {
    return data.reduce((acc, item) => {
      if (item[key]) {
        acc[item[key]] = (acc[item[key]] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handleDefaultChange = () => {
    setIsDefaultActive(!isDefaultActive);
    setSelectedFilters({
      countries: !isDefaultActive ? ["India"] : [],
      exchanges: !isDefaultActive ? ["NSE"] : [],
      currencies: [],
      types: [],
    });

    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try{
      const { error } = await supabase.auth.signOut()

      if (!error) {
        console.log("User logged out");
      }
    }
    catch(error){
      console.log('Signout',error);
    }
    handleClose();
  };


  const FilterSection = ({ category }) => {
    const key = filterCategories[category].key;
    const uniqueValues = getUniqueValues(filteredData, key);
    const counts = getCounts(filteredData, key);



    return (
      <FormGroup row>
        {uniqueValues.map((value) => (
          <FormControlLabel
            key={value}
            sx={{ display: "flex", flexDirection: "row" }}
            control={
              <Checkbox
                checked={selectedFilters[category].includes(value)}
                onChange={() => handleFilterChange(category, value)}
                disabled={isDefaultActive}
                sx={{
                  color: "white",
                  "&.Mui-checked": { color: "white" },
                  border: "1px solid grey",
                }}
              />
            }
            label={
              <Typography sx={{ color: "#fff", fontSize: "0.875rem", padding: "3px" }}>
                {value} ({counts[value] || 0})
              </Typography>
            }
          />
        ))}
      </FormGroup>
    );
  };

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
                sx={(theme) => ({
                  backgroundColor: "info.main !important",
                  width: "820px",
                  position: "relative",
                  [theme.breakpoints.down("sm")]: { maxWidth: "80px" },
                })}
              >
                <VuiInput
                  type="search"
                  size="large"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={{
                    component: (
                      <span role="img" aria-label="search">
                        🔍
                      </span>
                    ),
                    direction: "left",
                  }}
                  sx={(theme) => ({
                    [theme.breakpoints.down("sm")]: { maxWidth: "80px" },
                    backgroundColor: "white !important",
                  })}
                />

                {showDropdown && (
                  <List
                    sx={{
                      mt: 2,
                      bgcolor: "#012654",
                      borderRadius: 2,
                      position: "absolute",
                      width: "100%",
                      height: "20rem",
                      zIndex: 10,
                      overflow: "auto",
                    }}
                  >
                    <FormControlLabel
                      sx={{ display: "flex", p: 1 }}
                      control={
                        <Checkbox
                          checked={isDefaultActive}
                          onChange={handleDefaultChange}
                          sx={{ color: "white", "&.Mui-checked": { color: "white" }, ml: 3 }}
                        />
                      }
                      label={
                        <Typography sx={{ color: "#fff", fontSize: "14px" }}>
                          Advance search
                        </Typography>
                      }
                    />

                    <Box sx={{ px: 2, pb: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {Object.entries(filterCategories).map(([key, { label }]) => (
                          <Typography
                            key={key}
                            variant="subtitle2"
                            sx={{ color: "white", cursor: "pointer" }}
                            onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                          >
                            {label}
                            <BsChevronDown style={{ marginLeft: "5px", fontSize: "12px" }} />
                          </Typography>
                        ))}
                      </Box>

                      {activeDropdown && <FilterSection category={activeDropdown} />}
                    </Box>

                    {isLoading ? (
                      <Typography sx={{ padding: 2, textAlign: "center", color: "gray" }}>
                        Loading...
                      </Typography>
                    ) : error ? (
                      <Typography sx={{ padding: 2, textAlign: "center", color: "red" }}>
                        {error}
                      </Typography>
                    ) : filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <Box
                          key={`${item.symbol}-${index}`}
                          sx={{ px: 1, py: 0.1, color: "white !important" }}
                          onClick={() => {
                            handleClickStock(item);
                            setSearchTerm("");
                            setShowDropdown(false);
                          }}
                        >
                          <Box sx={{ cursor: "pointer", borderBottom: "0.2px solid grey", py: 2 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", gap: "5rem" }}
                            >
                              <Box sx={{ fontWeight: 900, fontSize: "15px" }}>
                                {item.company_name}
                              </Box>
                              <Box sx={{ display: "flex", gap: "2rem" }}>
                                <Box sx={{ fontSize: "13px" }}>{item.exchange}</Box>
                                <Box sx={{ fontSize: "13px" }}>
                                  {isDefaultActive && item.currency === "INR" ? "" : item.currency}
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box
                                  sx={{
                                    background: "#81878c",
                                    padding: "0.1rem 0.1rem",
                                    borderRadius: "10px",
                                    letterSpacing: "0.4px",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                  }}
                                >
                                  {item.symbol}
                                </Box>
                                <StockPrice
                                  symbol={item.symbol}
                                  mic_code={item.mic_code}
                                  supabase={supabase}
                                  percent_change={item.percent_change}
                                  close={item.close}
                                  source={item.source} // "api" or "supabase"
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ padding: 2, textAlign: "center", color: "gray" }}>
                        No results found
                      </Typography>
                    )}
                  </List>
                )}
              </Box>
            </VuiBox>
            <VuiBox color={light ? "white" : "inherit"}>
              {!user[0]?.username ? (
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
              ) : (
                <>
                  <IconButton sx={{ ml: 2 }} size="small" onClick={handleClick}>
                    <Icon
                      sx={({ palette: { white } }) => ({
                        color: light ? white.main : white.main,
                        mx: 0.5,
                      })}
                    >
                      account_circle
                    </Icon>
                    <VuiTypography
                      variant="button"
                      fontWeight="medium"
                      color={"white"}
                    >
                      {user[0]?.username}
                    </VuiTypography>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    id="logout-menu"
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleLogout} sx={{ color: "#fff" }} fontSize="bold">
                      <ListItemIcon >
                        <Logout fontSize="small" sx={{ color: "#fff" }}/>
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>

                </>
              )}

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
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
