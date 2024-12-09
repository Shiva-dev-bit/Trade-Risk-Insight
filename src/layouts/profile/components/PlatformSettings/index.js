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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";
import { MenuItem, Select } from "@mui/material";

function PlatformSettings() {
  const [settings, setSettings] = useState({
    majorSentimentShift: { enabled: false, frequency: "Real-time" },
    highImpactNews: { enabled: false, frequency: "Real-time" },
    technicalSignalChange: { enabled: false, frequency: "Real-time" },
    financialHealthAlert: { enabled: false, frequency: "Real-time" },
    riskThresholdBreach: { enabled: false, frequency: "Real-time" },
    dividendChangeAlert: { enabled: false, frequency: "Monthly" },
    fundHolderChangeAlert: { enabled: false, frequency: "Real-time" },
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: { ...settings[key], enabled: !settings[key].enabled },
    });
  };

  const handleFrequencyChange = (key, frequency) => {
    setSettings({
      ...settings,
      [key]: { ...settings[key], frequency },
    });
  };

  const renderNotificationItem = (label, key, frequencyOptions) => (
    <VuiBox display="flex" alignItems="center" mb="14px">
      <VuiBox mt={0.25}>
        <VuiSwitch
          color="info"
          checked={settings[key].enabled}
          onChange={() => handleToggle(key)}
        />
      </VuiBox>
      <VuiBox width="60%" ml={2}>
        <VuiTypography variant="button" fontWeight="regular" color="text">
          {label}
        </VuiTypography>
      </VuiBox>
      <VuiBox width="40%">
        <Select
          value={settings[key].frequency}
          onChange={(e) => handleFrequencyChange(key, e.target.value)}
          fullWidth
          size="small"
        >
          {frequencyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </VuiBox>
    </VuiBox>
  );

  return (
    <Card sx={{ maxHeight: "520px", height: "100%" }}>
      <VuiBox mb="26px">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          Notification Settings
        </VuiTypography>
      </VuiBox>
      <VuiBox lineHeight={1.25}>
        <VuiTypography
          variant="xxs"
          fontWeight="medium"
          mb="20px"
          color="text"
          textTransform="uppercase"
        >
          Notifications
        </VuiTypography>
        {renderNotificationItem("Major Sentiment Shift", "majorSentimentShift", [
          "Real-time",
          "Daily",
          "Weekly",
        ])}
        {renderNotificationItem("High-Impact News Event", "highImpactNews", [
          "Real-time",
          "Daily",
          "Weekly",
        ])}
        {renderNotificationItem("Technical Indicator Signal Change", "technicalSignalChange", [
          "Real-time",
          "Daily",
          "Weekly",
        ])}
        {renderNotificationItem("Financial Health Alert", "financialHealthAlert", [
          "Real-time",
          "Daily",
          "Weekly",
        ])}
        {renderNotificationItem("Portfolio Risk Threshold Breach", "riskThresholdBreach", [
          "Real-time",
          "Daily",
          "Weekly",
        ])}
        {renderNotificationItem("Dividend or Income Change Alert", "dividendChangeAlert", [
          "Real-time",
          "Monthly",
        ])}
        {renderNotificationItem("Fund Holder Change Alert", "fundHolderChangeAlert", [
          "Real-time",
          "Daily",
          "Weekly",
        ])}
      </VuiBox>
    </Card>
  );
}

export default PlatformSettings;
