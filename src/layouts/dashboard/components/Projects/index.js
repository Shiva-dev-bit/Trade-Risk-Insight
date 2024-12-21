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

import { useContext, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsCheckCircleFill } from "react-icons/bs";

// UI Risk LENS AI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// UI Risk LENS AI Dashboard Materail-UI example components
import Table from "examples/Tables/Table";

// Data
import data from "layouts/dashboard/components/Projects/data";
import { Box } from "@mui/material";
import { AuthContext } from "context/Authcontext";


function Projects() {
  const { columns, rows } = data();
  const { stockData } = useContext(AuthContext);


  return (
    <Card
      sx={{
        height: "100% !important",
        position: "relative", // Required for positioning child elements
        overflowX: "auto",
        padding : '10px'
      }}
    >
      {/* Content Section */}
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <SoftBox mb="auto">
          {/* Top Stock Market News */}
          <SoftTypography color="black" variant="lg" mb="6px" gutterBottom fontWeight="bold">
            Top Stock Market News
          </SoftTypography>

          {/* Microsoft Privacy Statement Link */}
          <SoftTypography color="#b4b4b4" variant="sm" style={{ fontSize: "11px", marginLeft: "16px" }}>
            <a
              href="https://privacy.microsoft.com/en-us/privacystatement"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#b4b4b4", textDecoration: "underline" }}
            >
              By Microsoft
            </a>
          </SoftTypography>
        </SoftBox>

        <SoftBox>
          <SoftTypography color="black" variant="lg" mb="6px" gutterBottom style={{ fontSize: "15px" }}fontWeight="bold">
            {stockData?.company_name}
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      {/* Table or Data Section */}
      <SoftBox
        sx={{
          "& th": {
            borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
              `${borderWidth[1]} solid ${grey[700]}`,
          },
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                `${borderWidth[1]} solid ${grey[700]}`,
            },
          },
        }}
      >
        <Box
          sx={{
            maxHeight: "400px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          <Table columns={columns} rows={rows} />
        </Box>
      </SoftBox>

      {/* Privacy Statement - Bottom Left */}
      <SoftTypography
        color="black"
        variant="sm"
        style={{
          fontSize: "11px",
          position: "absolute", // Keep it fixed at the bottom
          bottom: "8px",
          left: "16px",
        }}
      >
        <a
          href="https://privacy.microsoft.com/en-us/privacystatement"
          target="_blank"
          rel="noreferrer"
          style={{ color: "black", textDecoration: "underline" }}
        >
          *Privacy Statement
        </a>
      </SoftTypography>
    </Card>


  );

}

export default Projects;
