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
import { Divider } from "@mui/material";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// RiskCompass AI React components
import SoftBox from "/src/components/SoftBox";
import SoftTypography from "/src/components/SoftTypography";
import { AuthContext } from "/src/context/Authcontext";
import { supabase } from "/src/lib/supabase";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";

function TodoCard({selectedStock}) {
  const [notifications, setNotifications] = useState([]);
  const { session } = useContext(AuthContext); // Session context
  const userEmail = session?.user?.email; // Get user email from session
  const [user, setUser] = useState([]);

  console.log('todonotifications',selectedStock);


  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", userEmail);

      if (error) throw error;
      console.log("Fetched user data:", data); // Debugging user data
      if (data.length > 0) setUser(data); // Set user data only if available
      else console.log("No user found for the given email.");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log('useruser', user);

  // Fetch and initialize the state
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", selectedStock?.users?.user_id)
        .eq("stock_symbol", selectedStock?.symbol)

      // .gte("created_at", twoDaysAgoISO); // Filter by date

      if (error) throw error;

      if (data) {
        console.log('profilenotifications', data);
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    fetchUser();
  }, [userEmail , selectedStock?.symbol]);

  return (
    <Card sx={{ height: '100%' , color: '#67748e' }}>
      <SoftBox
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflowY: "auto",
          maxHeight: '460px',
          height: '100%'
        }}
      >
        <SoftBox p={2.5}>
          <SoftTypography
            variant="lg"     
            fontWeight="bold"
            mb={2}
            sx={{
              fontSize: "16px",
              display: 'block'
            }}
          >
            Notifications History
          </SoftTypography>

          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <SoftBox
                sx={{
                  padding: "12px",
                  borderRadius: "8px",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  mb: index < notifications.length - 1 ? 1 : 0
                }}
              >
                <SoftBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <SoftBox display="flex" alignItems="center" flexGrow={1}>
                    <SoftTypography
                      variant="button"
                      sx={{
                        fontSize: "13px",
                        textTransform: "none",
                      }}
                    >
                      <span style={{ color: '#f44335' }}>{notification.notification_alert_name}</span>
                      <span style={{ color: '#67748e', marginLeft: '4px' }}>{`(${notification.exchange})`}</span>
                    </SoftTypography>
                  </SoftBox>
                  <SoftTypography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      fontSize: "12px",
                      whiteSpace: 'nowrap',
                      marginLeft: '8px'
                    }}
                  >
                    {new Date(notification.created_at).toLocaleDateString()}
                  </SoftTypography>
                </SoftBox>

                <SoftTypography
                  variant="h6"
                  
                  fontWeight="bold"
                  sx={{
                    fontSize: "14px",
                    mb: 0.5
                  }}
                >
                  {notification.stock_symbol}
                </SoftTypography>

                <SoftTypography
                  variant="button"
                  color="textSecondary"
                  sx={{
                    fontSize: "13px",
                    textTransform: "none",
                    lineHeight: '1.4',
                    display: 'block'
                  }}
                >
                  {notification.notification_message}
                </SoftTypography>
              </SoftBox>

              {index < notifications.length - 1 && (
                <Divider
                  sx={{
                    borderColor: "#eeeeee",
                    my: 1
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

TodoCard.propTypes = {
  selectedStock: PropTypes.string,
};

export default TodoCard;

