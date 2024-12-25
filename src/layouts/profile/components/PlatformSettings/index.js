/*!

=========================================================
* Risk Protect AI React - v1.0.0
=========================================================

* Product Page: https://www.riskprotec.ai/product/riskprotect-ai
* Copyright 2021 RiskProtec AI (https://www.riskprotec.ai/)
* Licensed under MIT (https://github.com/riskprotectai/riskprotect-ai/blob/master LICENSE.md)

* Design and Coded by Simmmple & RiskProtec AI

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useContext, useEffect, useState } from "react";

// @mui material components
import { Card, Typography, Box, Switch, Tooltip, Button, Snackbar } from '@mui/material';
// UI Risk LENS AI Dashboard React components
import { MenuItem, Select } from "@mui/material";
import { supabase } from "lib/supabase";
import { AuthContext } from "context/Authcontext";


function PlatformSettings() {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({}); // State to store settings
  const { session } = useContext(AuthContext); // Session context
  const userEmail = session?.user?.email; // Get user email from session
  const [user, setUser] = useState([]); // To store fetched user data
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // Clear message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [successMessage]);

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
    const { data, error } = await supabase
      .from('notification_types')
      .select('*')
      .eq('is_deleted_yn', false);

    if (data) {
      setNotifications(data);
      setSettings(
        data.reduce((acc, notification) => {
          acc[notification.notification_id] = {
            enabled: false, // Default enabled state
            frequency: 'Real-time', // Default frequency
          };
          return acc;
        }, {})
      );
    }

    if (error) console.error('Error fetching notifications:', error);
  };

  // Handle toggle switch
  const handleToggle = (notificationId) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [notificationId]: {
        ...prevSettings[notificationId],
        enabled: !prevSettings[notificationId].enabled,
      },
    }));
  };

  // Handle frequency change
  const handleFrequencyChange = (notificationId, frequency) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [notificationId]: {
        ...prevSettings[notificationId],
        frequency,
      },
    }));
  };

  // Save settings
  const handleSave = async () => {
    for (const [notificationId, { enabled, frequency }] of Object.entries(settings)) {
      await upsertUserNotification(user[0]?.user_id, parseInt(notificationId), frequency, enabled);
    }
    setSuccessMessage('Settings saved successfully!');
    console.log('Settings saved.');
  };

  // Upsert function to handle insert or update
  const upsertUserNotification = async (userId, notificationTypeId, frequency, enabled) => {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('notification_type_id', notificationTypeId)
      .single();

    if (data) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_notifications')
        .update({ frequency, enabled })
        .eq('user_id', userId)
        .eq('notification_type_id', notificationTypeId);

      if (updateError) console.error('Error updating:', updateError);
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_notifications')
        .insert([{ user_id: userId, notification_type_id: notificationTypeId, frequency, enabled }]);

      if (insertError) console.error('Error inserting:', insertError);
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    fetchUser();
  }, [userEmail]);

  return (
    <Card
      sx={{
        padding: "20px",
        maxHeight: "520px",
        height: "100%",
        backgroundColor: "#fff", // Light gray transparent
        color: "#67748e", // Black text
        overflowY: "auto",
        fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Set font family
      }}
    >
      <Box mb="26px">
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "#67748e",
            fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Ensure consistent font family
          }}
        >
          Notification Settings
        </Typography>
      </Box>
      <Box>
        {notifications.map((notification) => (
          <Box
            key={notification.notification_id}
            display="flex"
            alignItems="center"
            mb={2}
            p={2}
            border="1px solid #ccc" // Light gray border
            borderRadius="8px"
            bgcolor="rgba(0, 0, 0, 0.1)" // Slightly darker gray background
            sx={{
              fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Add font family
            }}
          >
            <Box flex={1}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{
                  color: "#67748e",
                  fontSize: "16px",
                  lineHeight: "20px",
                  fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Add font family
                }}
              >
                {notification.name}
              </Typography>
              <Tooltip title={notification.description} placement="right">
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: "14px",
                    lineHeight: "16px",
                    fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Add font family
                  }}
                >
                  {notification.description.length > 50
                    ? `${notification.description.slice(0, 50)}...`
                    : notification.description}
                </Typography>
              </Tooltip>
            </Box>

            <Box>
              <Switch
                checked={settings[notification.notification_id]?.enabled}
                onChange={() => handleToggle(notification.notification_id)}
              />
            </Box>
            <Box ml={2}>
              <Select
                value={settings[notification.notification_id]?.frequency}
                onChange={(e) =>
                  handleFrequencyChange(notification.notification_id, e.target.value)
                }
                sx={{
                  fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Add font family to Select
                }}
              >
                <MenuItem value="Real-time">Real-time</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
              </Select>
            </Box>
          </Box>
        ))}
      </Box>
      <Box mt={4} display={"flex"}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Add font family to Button
          }}
        >
          Save Settings
        </Button>
        {successMessage && (
          <Typography
            mt={2}
            ml={2}
            color="success.main"
            fontWeight="small"
            fontSize={"12px"}
            sx={{
              fontFamily: '"Roboto","Helvetica","Arial","sans-serif"', // Add font family
            }}
          >
            {successMessage}
          </Typography>
        )}
      </Box>
    </Card>


  );
}

export default PlatformSettings;
