import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import team1 from "assets/images/avatar1.png";
import team2 from "assets/images/avatar2.png";
import team3 from "assets/images/avatar3.png";
import team4 from "assets/images/avatar4.png";
// Images
import profile1 from "assets/images/profile-1.png";
import profile2 from "assets/images/profile-2.png";
import profile3 from "assets/images/profile-3.png";
// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
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
import { useContext, useEffect, useState } from "react";
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
          <VuiBox mt={5} mb={3}>
            <Grid
              container
              spacing={3}
              sx={({ breakpoints }) => ({
                [breakpoints.only("xl")]: {
                  gridTemplateColumns: "repeat(2, 1fr)",
                },
              })}
            >
              <Grid
                item
                xs={12}
                xl={4}
                xxl={3}
                sx={({ breakpoints }) => ({
                  minHeight: "400px",
                  [breakpoints.only("xl")]: {
                    gridArea: "1 / 1 / 2 / 2",
                  },
                })}
              >
                <Welcome username={userId?.username && userId?.username} email={userId?.email} />
              </Grid>
              <Grid
                item
                xs={12}
                xl={5}
                xxl={6}
                sx={({ breakpoints }) => ({
                  [breakpoints.only("xl")]: {
                    gridArea: "2 / 1 / 3 / 3",
                  },
                })}
              >
                <CarInformations userdata={userId?.username && userId?.username} />
              </Grid>
              <Grid
                item
                xs={12}
                xl={3}
                xxl={3}
                sx={({ breakpoints }) => ({
                  [breakpoints.only("xl")]: {
                    gridArea: "1 / 2 / 2 / 3",
                  },
                })}
              >
                <ProfileInfoCard
                  title="profile information"
                  description={`Hi, I’m ${userId?.username && userId?.username
                    }, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).`}
                  info={{
                    fullName: `${userId?.username && userId?.username}`,
                    mobile: "(44) 123 1234 123",
                    email: `${userId?.email}`,
                    location: "United States",
                  }}
                  social={[
                    {
                      link: "https://www.facebook.com/CreativeTim/",
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: "https://twitter.com/creativetim",
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: "https://www.instagram.com/riskprotectai/",
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </VuiBox>
          <Grid container spacing={3} mb="30px">
            <Grid item xs={12}>
              <Card sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" }, p: 3, borderRadius: "12px" }}>
                {/* Platform Settings Section */}
                <VuiBox flex={1}>
                  <PlatformSettings />
                </VuiBox>

                {/* Notifications History Section */}
                <VuiBox
                  flex={1}
                  sx={{
                    backgroundColor: "#1a202c",
                    borderRadius: "12px",
                    maxHeight: "520px",
                    overflowY: "auto",
                  }}
                >
                  <VuiBox p={3}>
                    <VuiTypography variant="lg" color="white" fontWeight="bold" mb={3}>
                      Notifications History
                    </VuiTypography>

                    {notifications.map((notification) => (
                      <VuiBox
                        key={notification.id}
                        mb={2}
                        sx={{
                          padding: "12px",
                          borderRadius: "8px",
                          transition: "background-color 0.3s",
                          "&:hover": {
                            backgroundColor: "#3e5060",
                          },
                        }}
                      >
                        {/* Notification Type and Stock Exchange */}
                        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <VuiBox display="flex" alignItems="center">
                            <VuiTypography variant="button" color="error" mr={1}>
                              {notification.notification_type}
                            </VuiTypography>
                            <VuiTypography variant="button" color="text">
                              • {notification.exchange}
                            </VuiTypography>
                          </VuiBox>
                          <VuiTypography variant="caption" color="text">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </VuiTypography>
                        </VuiBox>

                        {/* Stock Symbol */}
                        <VuiBox mb={1}>
                          <VuiTypography variant="h6" color="white" fontWeight="bold">
                            {notification.stock_symbol}
                          </VuiTypography>
                        </VuiBox>

                        {/* Notification Message */}
                        <VuiTypography variant="button" color="text">
                          {notification.notification_message}
                        </VuiTypography>
                      </VuiBox>
                    ))}
                  </VuiBox>
                </VuiBox>
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
