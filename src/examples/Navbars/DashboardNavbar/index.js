import "./loader.css";
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
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItemIcon,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { supabase } from "lib/supabase";
import { BsCheckLg, BsChevronDown } from "react-icons/bs";
import StockPrice from "./StockPrice";
import { Add, Logout } from "@mui/icons-material";
import { AuthContext } from "context/Authcontext";
import axios from "axios";

function DashboardNavbar({ absolute, light, isMini, handleClickStock, addStockPortfolio }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [user, setUser] = useState([]); // To store fetched user data
  const [notifications, setNotifications] = useState([]); // To store notifications
  const { session } = useContext(AuthContext); // Session context
  const userEmail = session?.user?.email; // Get user email from session

  // Fetch user data from Supabase based on email
  const fetchUser = async (userMail) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", userMail);

      if (error) throw error;
      console.log("Fetched user data:", data); // Debugging user data
      if (data.length > 0) setUser(data); // Set user data only if available
      else console.log("No user found for the given email.");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch notifications based on the user's ID
  const fetchNotifications = async () => {
    try {
      if (!user[0] || !user[0].user_id) {
        console.log("User data is not yet loaded:", user); // Debugging missing user data
        return; // Exit early if user data is not ready
      }

      const userId = user[0]?.user_id;
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  console.log('notifications', notifications);

  useEffect(() => {
    const channel = supabase
      .channel('notification-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          const { eventType, new: newNotification, old: oldNotification } = payload;

          if (newNotification === user[0]?.user_id) {
            setNotifications((prevNotifications) => {


              switch (eventType) {
                case 'INSERT':
                  return [newNotification, ...prevNotifications]; // Add new notification at the beginning
                case 'UPDATE':
                  return prevNotifications.map((notification) =>
                    notification.id === newNotification.id ? newNotification : notification
                  );
                case 'DELETE':
                  return prevNotifications.filter(
                    (notification) => notification.id !== oldNotification.id
                  );
                default:
                  return prevNotifications;
              }
            });
          }
        }
      )
      .subscribe();

    if (user.length > 0) {
      fetchNotifications();
    }

    // Cleanup function
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  useEffect(() => {
    if (userEmail) {
      console.log("Fetching user for email:", userEmail); // Debugging user email
      fetchUser(userEmail);
    }
  }, [userEmail]);



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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Technical Indicator Signal Change":
        return "bar_chart"; // Example icon
      case "Price Alert":
        return "attach_money"; // Example icon
      default:
        return "notifications"; // Default icon
    }
  };

  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleNotificationClick = (id) => {
    console.log(`Notification with ID ${id} clicked.`);
    // Optionally, update read status in the database here
    handleCloseMenu();
  };


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
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            image={
              <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
                {getNotificationIcon(notification.notification_type)}
              </Icon>
            }
            title={[
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{
                  fontWeight: 700
                }}>
                  {notification.notification_type}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'white'
                }}>
                  {notification.notification_message}
                </span>
              </div>
            ]}
            date={formatNotificationDate(notification.created_at)}
            onClick={() => handleNotificationClick(notification.id)}
          />
        ))
      ) : (
        <NotificationItem
          color="text"
          title={["No notifications available"]}
          onClick={handleCloseMenu}
        />
      )}
    </Menu>
  );


  // const [searchTerm, setSearchTerm] = useState("");
  // const [filteredData, setFilteredData] = useState([]);
  // const [isDefaultActive, setIsDefaultActive] = useState(true);
  // const [activeDropdown, setActiveDropdown] = useState(null);
  // const [loading, setLoading] = useState(false);

  // const [selectedFilters, setSelectedFilters] = useState({
  //   countries: ["India"],
  //   exchanges: ["NSE"],
  //   currencies: [],
  //   types: [],
  // });

  // const filterCategories = {
  //   countries: { label: "Countries", key: "country" },
  //   exchanges: { label: "Exchanges", key: "exchange" },
  //   currencies: { label: "Currencies", key: "currency" },
  //   types: { label: "Financial Assets Types", key: "type" },
  // };

  // const handleSearch = (event) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);

  //   if (!value.trim()) {
  //     setActiveDropdown(null);
  //     setFilteredData([]);
  //   }
  // };

  // const fetchSearchData = async (query) => {
  //   setLoading(true); // Set loading to true before fetching
  //   if(query.length >= 3){
  //     try {
  //       const response = await axios.get(
  //         `https://rcapidev.neosme.co:2053/search/${query}`
  //       );
  //       let results = response.data || [];

  //       Object.entries(selectedFilters).forEach(([category, selectedValues]) => {
  //         if (selectedValues.length > 0) {
  //           const key = filterCategories[category].key;
  //           results =
  //             results.length > 0 && results.filter((item) => selectedValues.includes(item[key]));
  //         }
  //       });

  //       console.log('resultsresults',results);

  //       setFilteredData(results);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setFilteredData([]);
  //     } finally {
  //       setLoading(false); // Set loading to false after fetching
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const debounceTimer = setTimeout(() => {
  //     if (searchTerm.trim()) {
  //       fetchSearchData(searchTerm);
  //     } else {
  //       setFilteredData([]);
  //     }
  //   }, 300); // Debounce to reduce API calls

  //   return () => clearTimeout(debounceTimer);
  // }, [searchTerm, selectedFilters]);

  // const handleFilterChange = (category, value) => {
  //   setSelectedFilters((prev) => {
  //     const isChecked = prev[category].includes(value);
  //     const updatedFilters = isChecked
  //       ? prev[category].filter((v) => v !== value)
  //       : [...prev[category], value];

  //     return { ...prev, [category]: updatedFilters };
  //   });
  // };

  // const handleDefaultChange = () => {
  //   const newDefaultState = !isDefaultActive;
  //   setIsDefaultActive(newDefaultState);

  //   const defaultFilters = newDefaultState
  //     ? { countries: ["India"], exchanges: ["NSE"], currencies: [], types: [] }
  //     : { countries: [], exchanges: [], currencies: [], types: [] };

  //   setSelectedFilters(defaultFilters);
  // };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isDefaultActive, setIsDefaultActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const fetchSearchData = async (query) => {
    setLoading(true); // Show loading spinner
    if (query.length >= 3) {
      try {
        const response = await axios.get(
          `https://rcapidev.neosme.co:2053/search/${query}`
        );
        let results = response.data || [];

        Object.entries(selectedFilters).forEach(([category, selectedValues]) => {
          if (selectedValues.length > 0) {
            const key = filterCategories[category].key;
            results =
              results.length > 0 && results.filter((item) => selectedValues.includes(item[key]));
          }
        });

        setFilteredData(results);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredData([]);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    }
  };

  const fetchUserLocation = async () => {
    try {
      // Simulate a country for local testing
      const userCountry = "United States"; // Replace with any desired country
      const exchange = userCountry === "United States" ? "NASDAQ" : "International Exchange"; // Mocked exchange

      setSelectedFilters({
        countries: [userCountry],
        exchanges: [exchange],
        currencies: [],
        types: [],
      });
    } catch (error) {
      console.error("Error fetching user location:", error);
      setSelectedFilters({
        countries: ["India"],
        exchanges: ["NSE"],
        currencies: [],
        types: [],
      });
    }
  };


  // On component mount, fetch user location and set default filters
  useEffect(() => {
    if (isDefaultActive) {
      fetchUserLocation();
    }
  }, [isDefaultActive]);

  // Debounce search term and fetch data
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSearchData(searchTerm);
      } else {
        setFilteredData([]);
      }
    }, 300); // Debounce to reduce API calls

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedFilters]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setActiveDropdown(null);
      setFilteredData([]);
    }
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => {
      const isChecked = prev[category].includes(value);
      const updatedFilters = isChecked
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];

      return { ...prev, [category]: updatedFilters };
    });
  };

  const handleDefaultChange = () => {
    const newDefaultState = !isDefaultActive;
    setIsDefaultActive(newDefaultState);

    if (!newDefaultState) {
      // Reset filters when default is inactive
      setSelectedFilters({
        countries: [],
        exchanges: [],
        currencies: [],
        types: [],
      });
    } else {
      // Fetch user location when re-enabling default
      fetchUserLocation();
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    location.reload();
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        console.log("User logged out");
      }
    } catch (error) {
      console.log("Signout", error);
    }
    handleClose();
  };

  const FilterSection = ({ category }) => {
    const key = filterCategories[category].key;
    const uniqueValues = [...new Set(filteredData.map((item) => item[key]))].sort();
    const counts = filteredData.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});

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

  const [selectedStock, setSelectedStock] = useState(null); // Add this new state
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [averagePrice, setAveragePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  // Open modal when the button is clicked
  const handleAddButtonClick = (e, stock) => {
    e.stopPropagation(); // Prevent click event bubbling
    setOpenModal(true);
    setSelectedStock(stock);
  };

  // Close the modal
  const handleModalClose = (e) => {
    e.stopPropagation(); // Prevent unintended closures
    setOpenModal(false);
    setSelectedStock(null); // Clear selected stock when closing
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleStockInPortfolio = () => {
    console.log("Selected item:", selectedStock);
    if (!selectedStock) return;

    addStockPortfolio({
      stock: selectedStock,
      quantity: parseFloat(quantity),
      averagePrice: parseFloat(averagePrice),
      purchase_date: purchaseDate
    });

    // setSnackbarMessage(`${selectedStock?.company_name} has been added to your portfolio!`);
    // setSnackbarOpen(true);
    setOpenModal(false);
    setQuantity(""); // Reset fields
    setAveragePrice("");
    setSelectedStock(null);
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
                  width: "300px",
                  position: "relative",
                  [theme.breakpoints.down("xs")]: { width: "50px" }, // Extra small screens
                  [theme.breakpoints.between("xs", "sm")]: { width: "100px" }, // Small screens
                  [theme.breakpoints.between("sm", "md")]: { width: "200px" }, // Medium screens
                  [theme.breakpoints.between("md", "lg")]: { width: "300px" }, // Large screens
                  [theme.breakpoints.up("lg")]: { width: "700px" }, // Extra large screens
                  "@media (max-width: 1024px)": {
                    width: "250px", // Custom style for 1024x609 px
                  },
                })}
              >
                <VuiInput
                  type="search"
                  size="large"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
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

                {searchTerm && (
                  <List
                    sx={{
                      mt: 2,
                      bgcolor: "#012654",
                      borderRadius: 2,
                      position: "absolute",
                      width: "100%",
                      height: "20rem",
                      zIndex: 10,
                      overflow: "scroll",
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
                          Global search
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

                    {loading ? (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <div className="loader"></div> {/* Add your loader here */}
                      </Box>
                    ) : filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <Box
                          key={`${item.symbol}-${index}`}
                          sx={{ px: 3, py: 0.1, color: "white !important" }}
                          onClick={() => {
                            handleClickStock(item);
                            setSearchTerm("");
                          }}
                        >
                          <Box sx={{ cursor: "pointer", borderBottom: "0.2px solid grey", py: 2 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", gap: "5rem" }}
                            >
                              <Box sx={{ fontWeight: 900, fontSize: "15px" }}>
                                {item.company_name}
                              </Box>
                              <Box sx={{ display: "flex", gap: "2rem", pr: 10 }}>
                                <Box sx={{ fontSize: "14px", fontWeight: 900 }}>
                                  {item.exchange}
                                </Box>
                                <Box sx={{ fontSize: "14px", fontWeight: 900 }}>
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
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.symbol}
                                </Box>

                                <Box display={"flex"}>
                                  <StockPrice
                                    symbol={item.symbol}
                                    mic_code={item.mic_code}
                                    percent_change={item.percent_change}
                                    close={item.close}
                                  />
                                  <Box>
                                    {/* Button to open modal */}
                                    <Button
                                      size="large"
                                      // onClick={handleAddButtonClick}
                                      onClick={(e) => handleAddButtonClick(e, item)}
                                      title="Add to portfolio"
                                      sx={{ width: "20px" }}
                                    >
                                      <Add
                                        color="white"
                                        size="20"
                                        sx={{
                                          borderRadius: "5px",
                                          "&:hover": {
                                            background: "#fff",
                                            color: "#000",
                                          },
                                        }}
                                      />
                                    </Button>

                                    {/* Modal for entering Quantity & Average Price */}
                                    <Modal
                                      open={openModal}
                                      onClose={handleModalClose}
                                      disableEnforceFocus
                                      Backdrop={{
                                        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                                      }}
                                    >
                                      <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          width: 400,
                                          bgcolor: "background.paper",
                                          boxShadow: 24,
                                          p: 4,
                                          borderRadius: "8px",
                                          border: 0,
                                        }}
                                      >
                                        <h2>Add Stock Details</h2>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                          <label htmlFor="symbol" style={{ fontSize: "14px", marginBottom: "4px" }}>Quantity:</label>
                                          <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            color="success"
                                            type="number"
                                            fullWidth
                                            margin="dense"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            style={{ border: "2px solid #ccc", marginBottom: "8px" }}
                                          />
                                          <label htmlFor="symbol" style={{ fontSize: "14px", marginBottom: "4px" }}>Average Price:</label>
                                          <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            type="number"
                                            fullWidth
                                            margin="dense"
                                            value={averagePrice}
                                            onChange={(e) => setAveragePrice(e.target.value)}
                                            style={{ border: "2px solid #ccc", marginBottom: "8px" }}
                                          />
                                          <label htmlFor="symbol" style={{ fontSize: "14px", marginBottom: "4px" }}>Purchase Date:</label>
                                          <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            type="date"
                                            fullWidth
                                            margin="dense"
                                            value={purchaseDate}
                                            onChange={(e) => setPurchaseDate(e.target.value)}
                                            style={{ border: "2px solid #ccc", marginBottom: "16px" }}
                                          />
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            key={`${item.symbol}-${index}`}
                                            onClick={handleStockInPortfolio}
                                            fullWidth
                                            sx={{ mt: 1, color: "#fff" }}
                                          >
                                            Add to Portfolio
                                          </Button>
                                        </div>
                                      </Box>
                                    </Modal>
                                  </Box>
                                </Box>
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
                    <VuiTypography variant="button" fontWeight="medium" color={"white"}>
                      {user[0]?.username}
                    </VuiTypography>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    id="logout-menu"
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: "left", vertical: "top" }}
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleLogout} sx={{ color: "#fff" }} fontSize="bold">
                      <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: "#fff" }} />
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
