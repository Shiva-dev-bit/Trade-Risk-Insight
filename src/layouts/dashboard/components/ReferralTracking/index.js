import React, { useEffect, useState } from "react";
import { Card, Stack, Typography } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";
import { FaEllipsisH } from "react-icons/fa";
import linearGradient from "assets/theme/functions/linearGradient";
import CircularProgress from "@mui/material/CircularProgress";
import  axios  from "axios";
import { AuthContext } from "context/Authcontext";
import { useContext } from "react";

function ReferralTracking() {
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
        console.log('referal',result);
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
    background: linearGradient(
      gradients.cardDark.main,
      gradients.cardDark.state,
      gradients.cardDark.deg
    ),
    padding: "16px",
  }}
>
  <VuiBox sx={{ width: "100%" }}>
    <VuiBox sx={{ width: "100%" }} mb="20px" mt="20px">
      <Typography variant="h5" color="#fff" fontWeight="bold">
        <span style={{ fontSize: "medium" }}>{data?.title || "Safety Score"}</span>
      </Typography>
    </VuiBox>   
    <VuiBox
      display="flex"
      flexWrap="wrap" // Enable wrapping for content
      justifyContent="center"
      alignItems="center"
      gap="24px" // Add spacing between elements
    >
      {/* Circular Progress for Safety Score */}
      <VuiBox
        sx={{
          position: "relative",
          display: "inline-flex",
          mt: "24px",
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
        <VuiBox
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
          <VuiBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <VuiTypography color="text" variant="button" mb="4px">
              Safety
            </VuiTypography>
            <VuiTypography
              color="white"
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
            </VuiTypography>
            <VuiTypography color="text" variant="button">
              Total Score
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      {/* Metrics and Sentiment Boxes */}
      <VuiBox
        display="flex"
        flexDirection={{ xs: "column", md: "row" }} // Responsive direction
        justifyContent="center"
        alignItems="center"
        gap="24px"
        width="100%"
      >
        {/* Analyzed Metrics Box */}
        <VuiBox
          display="flex"
          width={{ xs: "100%", sm: "220px" }} // Responsive width
          p="20px 22px"
          flexDirection="column"
          sx={{
            background: linearGradient(
              cardContent.main,
              cardContent.state,
              cardContent.deg
            ),
            borderRadius: "20px",
          }}
        >
          <VuiTypography
            color="white"
            variant="button"
            fontWeight="regular"
            mb="5px"
          >
            {data?.analyzed_metrics || "Analyzed Metrics"}
          </VuiTypography>
        </VuiBox>

        {/* Sentiment Box */}
        <VuiBox
          display="flex"
          width={{ xs: "100%", sm: "220px" }} // Responsive width
          p="20px 22px"
          flexDirection="column"
          sx={{
            background: linearGradient(
              cardContent.main,
              cardContent.state,
              cardContent.deg
            ),
            borderRadius: "20px",
          }}
        >
          <VuiTypography
            color="white"
            variant="button"
            fontWeight="regular"
            mb="5px"
          >
            Sentiment:
            <br />
            {data?.sentiment_analysis || "N/A"}
          </VuiTypography>
        </VuiBox>
      </VuiBox>  
    </VuiBox>
  </VuiBox>
</Card>
  );
}
export default ReferralTracking;