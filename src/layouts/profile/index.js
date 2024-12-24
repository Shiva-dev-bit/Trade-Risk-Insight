
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// UI Risk LENS AI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import Footer from "examples/Footer";
// UI Risk LENS AI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import Welcome from "../profile/components/Welcome/index";
import CarInformations from "./components/CarInformations";
import { supabase } from "lib/supabase";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/Authcontext";
import { Box, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";

function Overview() {
  const [stocks, setStocks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState([]); // Dynamic userId
  const { session } = useContext(AuthContext);

  console.log('userId', userId);

  const getUserData = async () => {
    if (!session?.user?.email) return;

    const { data: userdata, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", session?.user?.email)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    if (userdata) {
      setUserId(userdata);
    }
  };


  const userid = userId?.user_id;

  const fetchNotifications = async () => {
    console.log('profilenotifications', userid);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userid)
      // .gte("created_at", twoDaysAgoISO); // Filter by date

      if (error) throw error;

      if (data) {
        console.log('profilenotifications', data);
      }
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };


  useEffect(() => {
    getUserData();
  }, [session]);

  useEffect(() => {
    if (userid) {
      fetchNotifications();
    }
  }, [userid]);

  return (
    <DashboardLayout>
      {userId ? (
        <>
          <Header username={userId?.username && userId?.username} email={userId?.email} />
          <SoftBox mt={5} mb={3}>
            <Grid container spacing={3}>
              {/* Welcome Component */}
              <Grid
                item
                xs={12}
                sx={{
                  minHeight: "400px", // Adjust height as needed
                }}
              >
                <Welcome username={userId?.username} email={userId?.email} />
              </Grid>

              {/* Remaining Components: CarInformations and ProfileInfoCard */}
              <Grid container item xs={12} spacing={3}>
                {/* CarInformations Component */}
                <Grid
                  item
                  xs={12}
                  md={6} // Takes half width on medium screens and above
                  sx={{
                    minHeight: "300px", // Adjust height as needed
                  }}
                >
                  <CarInformations userdata={userId?.username} />
                </Grid>

                {/* ProfileInfoCard Component */}
                <Grid
                  item
                  xs={12}
                  md={6} // Takes half width on medium screens and above
                  sx={{
                    minHeight: "300px", // Adjust height as needed
                  }}
                >
                  <ProfileInfoCard
                    title="profile information"
                    description={`Hi, I’m ${userId?.username}, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).`}
                    info={{
                      fullName: `${userId?.username}`,
                      mobile: "(44) 123 1234 123",
                      email: `${userId?.email}`,
                      location: "United States",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>


          </SoftBox>
          <Grid container spacing={3} mb="30px">
            <Grid item xs={12}>
              <Card
                sx={{
                  display: "flex",
                  gap: 3,
                  flexDirection: { xs: "column", lg: "row" },
                  p: 3,
                  borderRadius: "12px"
                }}
              >
                {/* Platform Settings Section */}
                <SoftBox flex={1}>
                  <PlatformSettings />
                </SoftBox>

                {/* Notifications History Section */}
                <SoftBox
                  flex={1}
                  sx={{
                    backgroundColor: "#f9f9f9", // Light gray background
                    borderRadius: "12px",
                    maxHeight: "520px",
                    overflowY: "auto",
                  }}
                >
                  <SoftBox p={3}>
                    <SoftTypography
                      variant="lg"
                      color="black"
                      fontWeight="bold"
                      mb={3}
                      sx={{ fontSize: "18px" }} // Reduced font size
                    >
                      Notifications History
                    </SoftTypography>

                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <SoftBox
                          mb={2}
                          sx={{
                            padding: "12px",
                            borderRadius: "8px",
                            transition: "background-color 0.3s",
                            "&:hover": {
                              backgroundColor: "#e0e0e0", // Lighter gray hover effect
                            },
                          }}
                        >
                          {/* Notification Type and Stock Exchange */}
                          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <SoftBox display="flex" alignItems="center">
                              <SoftTypography
                                variant="button"
                                color="error"
                                mr={1}
                                sx={{ fontSize: "14px", textTransform: "none" }} // Reduced font size and removed capitalization
                              >
                                {notification.notification_type}
                              </SoftTypography>
                              <SoftTypography
                                variant="button"
                                color="textSecondary"
                                sx={{ fontSize: "14px", textTransform: "none" }} // Reduced font size and removed capitalization
                              >
                                • {notification.exchange}
                              </SoftTypography>
                            </SoftBox>
                            <SoftTypography
                              variant="caption"
                              color="textSecondary"
                              sx={{ fontSize: "12px", textTransform: "none" }} // Smaller font size for the date
                            >
                              {new Date(notification.created_at).toLocaleDateString()}
                            </SoftTypography>
                          </SoftBox>

                          {/* Stock Symbol */}
                          <SoftBox mb={1}>
                            <SoftTypography
                              variant="h6"
                              color="black"
                              fontWeight="bold"
                              sx={{ fontSize: "16px", textTransform: "none" }} // Reduced font size
                            >
                              {notification.stock_symbol}
                            </SoftTypography>
                          </SoftBox>

                          {/* Notification Message */}
                          <SoftTypography
                            variant="button"
                            color="textSecondary"
                            sx={{ fontSize: "14px", textTransform: "none" }} // Reduced font size
                          >
                            {notification.notification_message}
                          </SoftTypography>
                        </SoftBox>

                        {/* Divider */}
                        {index < notifications.length - 1 && (
                          <Divider sx={{ borderColor: "#ddd", marginBottom: "16px" }} />
                        )}
                      </React.Fragment>
                    ))}
                  </SoftBox>
                </SoftBox>


              </Card>
            </Grid>
          </Grid>

        </>
      ) : (
        <Box my={"15%"} mx={"33%"} sx={{ height: "27vh" }}>
          <Button
            component={Link}
            variant="contained"
            sx={{ background: "#0047AB", fontSize: "17px" }}
            to="/authentication/sign-in"
          >
            Sign in to see your profile
          </Button>
        </Box>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
