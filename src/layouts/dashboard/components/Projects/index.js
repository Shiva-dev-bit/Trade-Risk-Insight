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

import { useContext, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsCheckCircleFill } from "react-icons/bs";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

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
        overflowX: "auto"
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiBox mb="auto">
          {/* Top Stock Market News */}
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            Top Stock Market News
          </VuiTypography>

          {/* Microsoft Privacy Statement Link */}
          <VuiTypography color="#b4b4b4" variant="sm" style={{ fontSize: '11px' , marginLeft: '16px'}}>
            <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" style={{ color: '#b4b4b4', textDecoration: 'underline' }}>
              By Microsoft
            </a>
          </VuiTypography>
        </VuiBox>

        <VuiBox>
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom style={{ fontSize: '15px' }}>
            {stockData?.company_name}
          </VuiTypography>
        </VuiBox>
      </VuiBox>



      <VuiBox
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
            overflowY: "auto",  // Allows both vertical and horizontal scrolling simultaneously
            "&::-webkit-scrollbar": {
              width: "6px",       // Width for vertical scrollbar
              height: "6px",      // Height for horizontal scrollbar
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
      </VuiBox>
      <VuiTypography color="#b4b4b4" variant="sm" style={{ fontSize: '11px' }}>
            <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" style={{ color: '#b4b4b4', textDecoration: 'underline' }}>
              *Privacy Statement
            </a>
          </VuiTypography>
    </Card>
  );

}

export default Projects;
