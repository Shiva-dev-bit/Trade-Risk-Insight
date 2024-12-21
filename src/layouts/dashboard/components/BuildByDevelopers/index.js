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
      <Card sx={{ height: "100%", color: 'black' }}>
        <SoftBox display="flex" flexDirection="column" padding={2} sx={{ textAlign: 'center' }}>
          <SoftBox>
            <SoftTypography variant="h5" color="black" fontWeight="bold" mb="45px">
              <span style={{fontSize:'medium'}}>Volatility Score </span>
              <span style={{fontSize:'medium'}}> {stockData?.stockData?.symbol}</span>
            </SoftTypography>
          </SoftBox>
          <SoftBox sx={{ alignSelf: "center", justifySelf: "center", zIndex: "-1", mb: 4 }}>
            <SoftBox sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={(data?.volatility_score ?? 0) * 100}
                size={150}
                color="black"
              />
    
              <SoftBox
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SoftBox
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaArrowsAltV size="40px" color="#000   " />
                </SoftBox>
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
