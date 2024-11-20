/*!

=========================================================
* Risk Protect AI React - v1.0.0
=========================================================

* Product Page: https://www.riskprotec.ai/product/riskprotect-ai
* Copyright 2021 RiskProtec AI (https://www.riskprotec.ai/)
* Licensed under MIT (https://github.com/riskprotectai/riskprotect-ai/blob/master LICENSE.md)

* Design and Coded by Simmmple & RiskProtec AI

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/

import { useState, useEffect, useMemo, useContext } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";

// UI Risk LENS AI Dashboard React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// UI Risk LENS AI Dashboard React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// UI Risk LENS AI Dashboard React routes
import routes from "routes";

// UI Risk LENS AI Dashboard React contexts
import { useVisionUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { AuthContext } from "context/Authcontext";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { supabase } from "lib/supabase";
import { Snackbar, SnackbarContent } from "@mui/material";
import { axiosInstance } from "SSL_disable";
import { useStockContext } from "context/StockContext";

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { session, storeStockData } = useContext(AuthContext);
  const { fetchUserStocks } = useStockContext();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // console.log("Session: ", session);

  let routesNew;
  if (session?.refresh_token) {
    routesNew = routes.filter((route) => route.name !== "Sign Up" && route.name !== "Sign In");
  } else {
    routesNew = routes.filter((route) => route.name !== "Profile" && route.name !== "Portfolio");
  }

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      // Check for the custom route type
      if (route.route && route.type === "route") {
        return <Route exact path={route.route} component={route.component} key={route.key} />;
      }

      if (route.route) {
        return <Route exact path={route.route} component={route.component} key={route.key} />;
      }

      return null;
    });

  // let userId = 1;
  const [userId, setUserId] = useState(null);
  const getUserData = async () => {
    if (!session?.user?.email) return;

    const { data: userdata, error } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", session.user.email)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    if (userdata) {
      setUserId(userdata.user_id);
    }
  };

  const handleClickStock = (getStock) => {
    // console.log("getStock before storing:", getStock); 
    if (getStock) {
      storeStockData(getStock);
    } else {
      console.log("getStock is null or undefined");
    }
  };

  const [stocks, setStocks] = useState([]);

  const fetchStockFromAPI = async (symbol, exchange) => {
    try {
      const response = await axiosInstance.get(
        `/search/${symbol}`
      );
      const data = response.data;

      // Filter data by exchange
      return data.find((stock) => stock?.exchange === exchange) || {};
    } catch (error) {
      console.error(`Error fetching stock for in fetchStockFromAPI ${symbol}:`, error);
      return {}; // Return empty object in case of error
    }
  };
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [colorstatus, setColorstatus] = useState("");
  const snackbarTheme = {
    success: {
      backgroundColor: "#008000",
    },
    error: {
      backgroundColor: "#FF0000",
    },
    existing: {
      backgroundColor: "#808080",
    },
  };

  const addStockPortfolio = async (stock) => {
    console.log("Attempting to add stock:", stock);

    // Exit if no userId is found
    if (!userId) return;

    const stockIdentifier = {
      symbol: stock?.stock?.symbol,
      exchange: stock?.stock?.exchange,
    };

    // Step 1: Check if the stock exists for this user and is not deleted
    const { data: existingStock, error: fetchError } = await supabase
      .from("userPortfolio")
      .select("*")
      .eq("user_id", userId)
      .eq("symbol", stockIdentifier.symbol)
      .eq("exchange", stockIdentifier.exchange)
      .eq("is_deleted_yn", false)
      .single();

    // Handle fetch error if it is not the "no rows found" error (PGRST116)
    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching stock:", fetchError);
      return;
    }

    // If the stock already exists, show a message and return
    if (existingStock) {
      console.log("Stock already exists in the portfolio:", existingStock);
      setSnackbarMessage(`${stock?.stock?.company_name} already exists in your portfolio.`);
      setColorstatus("existing");
      setSnackbarOpen(true);
      return;
    }

    // Step 2: Insert the stock if it doesn't exist
    const { data, error } = await supabase.from("userPortfolio").insert([
      {
        user_id: userId,
        quantity: stock.quantity || 0,
        average_price: stock.averagePrice || 0,
        is_deleted_yn: false,
        ...stockIdentifier,
      },
    ]);

    // Handle insertion errors and success cases
    if (error) {
      console.error("Error adding stock:", error);
      setColorstatus("error");
    } else {
      console.log("Stock added successfully:", data);
      setColorstatus("success");
      setSnackbarMessage(`${stock?.stock?.company_name} has been added to your portfolio!`);
      setSnackbarOpen(false);

      // Refresh user's stock portfolio
      // location.reload();
      fetchUserStocks();
    }
  };

  useEffect(() => {
    getUserData();
  }, [session]);

  const configsButton = (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </VuiBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand=""
              brandName="Risk Protect AI"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/dashboard" />
        </Switch>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand=""
              brandName="Risk Protect AI"
              routes={routesNew}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <DashboardLayout>
              <DashboardNavbar
                addStockPortfolio={addStockPortfolio}
                handleClickStock={handleClickStock}
                // fetchStockFromAPI={fetchStockFromAPI}
              />
              {snackbarOpen && (
                <Snackbar
                  open={snackbarOpen}
                  // onClose={() => setSnackbarOpen(false)}
                  // message={snackbarMessage}
                  autoHideDuration={3000} // Close the snackbar after 3 seconds
                  // sx={{ backgroundColor: colorstatus }} // Change color as needed
                  // sx={snackbarTheme[colorstatus] || {}} // Use the theme object
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <SnackbarContent
                    message={snackbarMessage}
                    onClose={() => setSnackbarOpen(false)}
                    // sx={{ backgroundColor: "red" }}
                    sx={snackbarTheme[colorstatus] || {}} // Use the theme object
                  />
                </Snackbar>
              )}
            </DashboardLayout>

            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/dashboard" />
        </Switch>
      </ThemeProvider>
    </>
  );
}
