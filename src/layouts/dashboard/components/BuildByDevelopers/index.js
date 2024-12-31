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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// RiskCompass AI React components
import SoftBox from "/src/components/SoftBox";
import SoftTypography from "/src/components/SoftTypography";

// Images
import wavesWhite from "/src/assets/images/shapes/waves-white.svg";
import rocketWhite from "/src/assets/images/illustrations/rocket-white.png";
import { CircularProgress } from "@mui/material";
import { FaArrowsAltV } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "/src/context/Authcontext";
import axios from "axios";
import { BiUpArrowAlt, BiDownArrowAlt, BiSolidUpArrowAlt } from 'react-icons/bi';




function BuildByDevelopers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const stockData = useContext(AuthContext);

  console.log('Volatility', data);
  // volatility/AXISBANK
  useEffect(() => {
    axios
      .get(`https://rcapidev.neosme.co:2053/volatility/${stockData?.stockData?.symbol || 'NSEI'}/${stockData?.stockData?.exchange || 'NSE'}`)
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [stockData?.stockData?.symbol]);



  return (
    <Card sx={{ color: 'rgb(103, 116, 142)', height: '100%' }}>
      <SoftBox display="flex" flexDirection="column" padding={2} sx={{ textAlign: 'center' }}>
        <SoftBox>
          <SoftTypography variant="h5"  fontWeight="bold" mb="45px">
            <span style={{ fontSize: 'medium' }}>Volatility Score </span>
            <span style={{ fontSize: 'medium' }}> {stockData?.stockData?.symbol}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: -1, // Use numeric value without quotes
            mb: 4,
          }}
        >
          {/* Circular Progress Container */}
          <SoftBox
            sx={{
              position: "relative",
              display: "inline-flex",
            }}
          >
            {/* Circular Progress */}
            <CircularProgress
              variant="determinate"
              value={(data?.volatility_score ?? 0) * 100}
              size={150}
              thickness={4} // Optional: Adjust the thickness of the circle
              sx={{
                color: "black", // Set progress bar color
              }}
            />

            {/* Inner Content (Centered Arrow) */}
            <SoftBox
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // Center the content
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                backgroundColor: "black", // Optional: Add a background color for contrast
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: Add shadow for styling
              }}
            >
              <BiSolidUpArrowAlt size="30px" color="black" /> {/* Adjust size and color */}
            </SoftBox>
          </SoftBox>
        </SoftBox>

        <SoftBox
          sx={({ breakpoints }) => ({
            width: "90%",
            padding: "18px 22px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            height: "82px",
            mx: "auto",
            borderRadius: "20px",
            transform: "translateY(10%)",
            zIndex: "1000",
          })}
        >
          <SoftTypography color="black" variant="caption" display="inline-block" fontWeight="regular">
            0%
          </SoftTypography>
          <SoftBox
            flexDirection="column"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ minWidth: "80px" }}
          >
            <SoftTypography color="black" variant="h5">
              {(data?.volatility_score * 100).toFixed(2)}%
            </SoftTypography>
            <SoftTypography color="black" variant="caption" fontWeight="regular" sx={{ fontSize: '10px' }}>
              Based on APARCH model volatility
            </SoftTypography>
          </SoftBox>
          <SoftTypography color="black" variant="caption" display="inline-block" fontWeight="regular">
            100%
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default BuildByDevelopers;
