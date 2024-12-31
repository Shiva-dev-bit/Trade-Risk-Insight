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
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Images
import wavesWhite from "assets/images/shapes/waves-white.svg";
import rocketWhite from "assets/images/illustrations/rocket-white.png";
import { CircularProgress } from "@mui/material";
import { FaArrowsAltV } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/Authcontext";
import axios from "axios";
import { BiSolidArrowFromBottom, BiSolidArrowToTop } from 'react-icons/bi';




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
      <SoftBox
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        height="100%"
        padding={2}
      >
        {/* Title at the Top */}
        <SoftTypography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={2}
          sx={{ fontSize: '19px' }}
          color="text"
        >
          Volatility Score {stockData?.stockData?.symbol}
        </SoftTypography>

        {/* Icon with Circular Progress */}
        <SoftBox
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
          }}
        >
          {/* Circular Progress */}
          <CircularProgress
            variant="determinate"
            value={(data?.volatility_score || 0) * 100}
            size={160}
            thickness={3}
            sx={{
              color: '#0758ed', // Adjust the color of the progress bar
            }}
          />
          {/* Icon */}
          <SoftBox
            sx={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaArrowsAltV size={90} color="#01b574" />
          </SoftBox>
        </SoftBox>

        {/* Score at the Bottom */}
        <SoftBox
          sx={({ breakpoints }) => ({
            width: '90%',
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            height: '82px',
            mx: 'auto',
            borderRadius: '20px',
            transform: 'translateY(10%)',
            zIndex: '1000',
            backgroundColor: 'rgba(192, 191, 191, 0.5)',
          })}
        >
          <SoftTypography
            color="dark"
            variant="caption"
            fontWeight="regular"
          >
            0%
          </SoftTypography>
          <SoftBox
            flexDirection="column"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ minWidth: '80px' }}
          >
            <SoftTypography color="text" variant="h5" sx={{fontSize : '30px'}}>
              {(data?.volatility_score * 100).toFixed(2)}%
            </SoftTypography>
            <SoftTypography
              color="dark"
              variant="caption"
              fontWeight="regular"
              sx={{ fontSize: '10px', textAlign: 'center' }}
            >
              Based on APARCH model volatility
            </SoftTypography>
          </SoftBox>
          <SoftTypography
            color="dark"
            variant="caption"
            fontWeight="regular"
          >
            100%
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default BuildByDevelopers;
