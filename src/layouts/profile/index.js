/**
=========================================================
* RiskCompass AI React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// RiskCompass AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// RiskCompass AI React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "context/Authcontext";
import { supabase } from "lib/supabase";
import { Alert } from "@mui/material";


function Overview() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", severity: "" });
  const { session } = useContext(AuthContext);
  const userEmail = session?.user?.email;

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

  return (
    <DashboardLayout>
      <Header 
        user={user}
      />
      <SoftBox mt={5} mb={3}>
        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6} xl={4}>
            <PlatformSettings />
          </Grid> */}
          <Grid item xs={12} md={6} xl={4}>
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
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;