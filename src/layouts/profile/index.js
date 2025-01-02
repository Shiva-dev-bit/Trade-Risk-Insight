
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// UI Risk LENS AI Dashboard React components
import SoftBox from "/src/components/SoftBox";
import SoftTypography from "/src/components/SoftTypography";
import ProfileInfoCard from "/src/examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "/src/examples/Cards/ProjectCards/DefaultProjectCard";
import Footer from "/src/examples/Footer";
// UI Risk LENS AI Dashboard React example components
import DashboardLayout from "/src/examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "/src/layouts/profile/components/Header";
import PlatformSettings from "/src/layouts/profile/components/PlatformSettings";
import Welcome from "../profile/components/Welcome/index";
import CarInformations from "./components/CarInformations";
import { supabase } from "/src/lib/supabase";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "/src/context/Authcontext";
import { Box, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";

function Overview() {
  const[user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", severity: "" });
  const [stocks, setStocks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState([]); // Dynamic userId
  const { session } = useContext(AuthContext);
  const userEmail = session?.user?.email;

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

  const fetchUser = async (userMail) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", userMail)
        .single();

      if (error) throw error;

      if (data) {
        console.log("User data:", data);
        setUser(data);
        setEditedUser(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUser(userEmail);
    }
  }, [userEmail]);

  const handleEdit = () => {
    setIsEditing(true);
    // Set editedUser with raw values, no defaults
    setEditedUser({
      ...user,
      username: user?.username || "",
      mobile_number: user?.mobile_number || "",
      country: user?.country || "",
      email: user?.email || userEmail
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    try {
      // Only update fields that are not empty
      const updateData = {};
      if (editedUser.username) updateData.username = editedUser.username;
      if (editedUser.mobile_number) updateData.mobile_number = editedUser.mobile_number;
      if (editedUser.country) updateData.country = editedUser.country;

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("email", userEmail)
        .select();

      if (error) throw error;

      setUser({ ...user, ...updateData });
      setIsEditing(false);
      setAlert({
        show: true,
        message: "Profile updated successfully!",
        severity: "success"
      });

      setTimeout(() => {
        setAlert({ show: false, message: "", severity: "" });
      }, 3000);

    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        show: true,
        message: "Error updating profile. Please try again.",
        severity: "error"
      });
    }
  };

  const handleChange = (field) => (event) => {
    console.log("Changing field:", field, "to value:", event.target.value);
    setEditedUser(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const getProfileInfo = () => {
    if (isEditing) {
      // When editing, use raw values with no defaults
      return {
        fullName: editedUser?.username || "",
        mobile: editedUser?.mobile_number || "",
        email: editedUser?.email || userEmail,
        location: editedUser?.country || ""
      };
    } else {
      // When displaying, use defaults for empty values
      return {
        fullName: user?.username || "Not provided",
        mobile: user?.mobile_number || "Not provided",
        email: user?.email || userEmail || "Not provided",
        location: user?.country || "Not provided"
      };
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
          <Header username={userId?.username && userId?.username } email={userId?.email} />
          <SoftBox mt={5} mb={3} style={{marginTop:"24px"}}>
            {/* Welcome Component */}
            {/* <Grid
                item
                xs={12}
                sx={{
                  minHeight: "400px", // Adjust height as needed
                }}
              >
                <Welcome username={userId?.username} email={userId?.email} />
              </Grid> */}
              {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

            {/* Remaining Components: CarInformations and ProfileInfoCard */}
            <Grid container item xs={12} spacing={3}>
              {/* CarInformations Component */}
              {/* <Grid
                  item
                  xs={12}
                  md={6} // Takes half width on medium screens and above
                  sx={{
                    minHeight: "300px", // Adjust height as needed
                  }}
                >
                  <CarInformations userdata={userId?.username} />
                </Grid> */}

              {/* ProfileInfoCard Component */}
              <Grid
                item
                xl={12} // Takes half width on medium screens and above
                sx={{
                  minHeight: "300px", // Adjust height as needed
                }}
              >
                <ProfileInfoCard
                  title={isEditing ? "edit profile information" : "profile information"}
                  info={getProfileInfo()}
                  action={{
                    tooltip: isEditing ? "Save Changes" : "Edit Profile",
                    onClick: isEditing ? handleSave : handleEdit
                  }}
                  isEditing={isEditing}
                  onChange={handleChange}
                  onCancel={handleCancel}
                />
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
                  borderRadius: "12px",
                  background: '#fff'
                }}
              >
                {/* Platform Settings Section */}
                <SoftBox flex={1}
                sx={{
                  borderRadius:"5px",
                  border: "2px solid #ddd"
                }}>
                  <PlatformSettings />
                </SoftBox>

                {/* Notifications History Section */}
                <SoftBox
                  flex={1}
                  sx={{
                    backgroundColor: "#fff", // Light gray background
                    borderRadius:"5px",
                  border: "2px solid #ddd",
                    maxHeight: "520px",
                    overflowY: "auto",
                    color : '#67748e',
                    fontFamily: '"Roboto","Helvetica","Arial","sans-serif"'
                  }}
                >
                  <SoftBox p={3}>
                    <SoftTypography
                      variant="lg"
                      color="text"
                      fontWeight="bold"
                      mb={3}
                      sx={{ fontSize: "18px" ,fontFamily: '"Roboto","Helvetica","Arial","sans-serif"' }} // Reduced font size
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
                            fontFamily: '"Roboto","Helvetica","Arial","sans-serif"'
                          }}
                        >
                          {/* Notification Type and Stock Exchange */}
                          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <SoftBox display="flex" alignItems="center">
                              <SoftTypography
                                variant="button"
                                color="error"
                                mr={1}
                                sx={{ fontSize: "14px", textTransform: "none" , fontFamily: '"Roboto","Helvetica","Arial","sans-serif"' }} // Reduced font size and removed capitalization
                              >
                                 {notification.notification_alert_name}
                              </SoftTypography>
                              <SoftTypography
                                variant="button"
                                color="text"
                                sx={{ fontSize: "14px", textTransform: "none" , fontFamily: '"Roboto","Helvetica","Arial","sans-serif"' }} // Reduced font size and removed capitalization
                              >
                                • {notification.exchange}
                              </SoftTypography>
                            </SoftBox>
                            <SoftTypography
                              variant="caption"
                              color="text"
                              sx={{ fontSize: "12px", textTransform: "none" }} // Smaller font size for the date
                            >
                              {new Date(notification.created_at).toLocaleDateString()}
                            </SoftTypography>
                          </SoftBox>

                          {/* Stock Symbol */}
                          <SoftBox mb={1}>
                            <SoftTypography
                              variant="h6"
                              fontWeight="bold"
                              sx={{ fontSize: "16px", textTransform: "none" }} // Reduced font size
                            >
                              {notification.stock_symbol}
                            </SoftTypography>
                          </SoftBox>

                          {/* Notification Message */}
                          <SoftTypography
                            // variant="button"
                            color="text"
                            sx={{ fontSize: "14px", textTransform: "none" , fontFamily: '"Roboto","Helvetica","Arial","sans-serif"'}} // Reduced font size
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