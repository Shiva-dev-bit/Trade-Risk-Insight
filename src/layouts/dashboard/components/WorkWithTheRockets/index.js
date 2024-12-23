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

import React, { useEffect, useState } from "react";
import { Card, Stack, Typography } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import colors from "assets/theme/base/colors";
import { FaEllipsisH } from "react-icons/fa";
import linearGradient from "assets/theme/functions/linearGradient";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { AuthContext } from "context/Authcontext";
import { useContext } from "react";

function WorkWithTheRockets() {
  const stockData = useContext(AuthContext);
  const [data, setData] = useState(null);
  const { gradients } = colors;
  const { cardContent } = gradients;
  useEffect(() => {
    // Fetch the data from the API
    const fetchData = async () => {
      try {
        const response = await axios(`https://rcapidev.neosme.co:2053/svs-widget/${stockData?.stockData?.symbol || 'NSEI'}`);
        const result = await response.data;
        console.log('referal', result);
        setData(result);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchData();
  }, [stockData?.stockData?.symbol]);


  return (
    <Card
      sx={{
        height: "100%",
        padding: "16px",
      }}
    >
      <SoftBox sx={{ width: "100%" }}>
        <SoftBox sx={{ width: "100%" , display : 'flex' }}>
          <SoftTypography variant="h5" color="black" fontWeight="bold" sx={{textAlign : 'center'}}>
            <span style={{ fontSize: "medium" }}>{data?.title || "Safety Score"}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox
          display="flex"
          flexWrap="wrap" // Enable wrapping for content
          justifyContent="center"
          alignItems="center"
          gap="24px" // Add spacing between elements
        >
          {/* Circular Progress for Safety Score */}
          <SoftBox
            sx={{
              position: "relative",
              display: "inline-flex",
              mt: "40px",
              mb:"55px",
              width: { xs: "100%", sm: "auto" }, // Adjust width for small screens
              justifyContent: "center",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={data?.safety_score * 10 || 0} // Convert safety score to percentage
              disableShrink={true}
              size={154} // Adjust size for laptops
              color="success"
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
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <SoftTypography color="black" variant="button" mb="4px">
                  Safety
                </SoftTypography>
                <SoftTypography
                  color="black"
                  variant="d5"
                  fontWeight="bold"
                  mb="4px"
                  sx={({ breakpoints }) => ({
                    [breakpoints.only("xl")]: {
                      fontSize: "32px",
                    },
                  })}
                >
                  {data?.safety_score || "0"}
                </SoftTypography>
                <SoftTypography color="black" variant="button">
                  Total Score
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
          {/* Metrics and Sentiment Boxes */}
        </SoftBox>
          <SoftBox
            display="flex"
            flexDirection={{ xs: "column", md: "row" }} // Responsive direction
            justifyContent="center"
            alignItems="center"
            gap="24px"
            width="100%"
          >
            {/* Analyzed Metrics Box */}
            <SoftBox
              display="flex"
              width={{ xs: "100%", sm: "220px" }} // Responsive width
              // p="20px 22px"
              flexDirection="column"
              sx={{
                borderRadius: "20px",
              }}
            >
              <SoftTypography
                color="black"
                variant="button"
                fontWeight="regular"
                mb="5px"
              >
                {data?.analyzed_metrics || "Analyzed Metrics"}
              </SoftTypography>
            </SoftBox>

            {/* Sentiment Box */}
            <SoftBox
              display="flex"
              width={{ xs: "100%", sm: "220px" }} // Responsive width
              // p="20px 22px"
              flexDirection="column"
              sx={{
                borderRadius: "20px",
              }}
            >
              <SoftTypography
                color="black"
                variant="button"
                fontWeight="regular"
                mb="5px"
              >
                Sentiment:
                <br />
                {data?.sentiment_analysis || "N/A"}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
      </SoftBox>
    </Card>
  );

}

export default WorkWithTheRockets;
