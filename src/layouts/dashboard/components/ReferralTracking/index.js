import React, { useEffect, useState } from "react";
import { Card, Stack, Typography } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";
import { FaEllipsisH } from "react-icons/fa";
import linearGradient from "assets/theme/functions/linearGradient";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { AuthContext } from "context/Authcontext";
import { useContext } from "react";

function ReferralTracking() {
  console.log('referal');
  const stockData = useContext(AuthContext);


  const [data, setData] = useState(null);
  const { gradients } = colors;
  const { cardContent } = gradients;
  useEffect(() => {
    // Fetch the data from the API
    const fetchData = async () => {
      try {
        const response = await axios(`http://172.235.16.92:8000/svs-widget/${stockData?.stockData?.symbol}`);
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
      }}
    >
      <VuiBox sx={{ width: "100%" }}>
        <VuiBox sx={{ width: "100%" }} mb="40px" mt="20px">
          <Typography variant="h5" color="#fff" fontWeight="bold">
            <span style={{fontSize:'medium'}}>{data?.title || "Safety Score"}</span>
          </Typography>
        </VuiBox>
        <VuiBox
          display="flex"
          sx={({ breakpoints }) => ({
            [breakpoints.up("xs")]: {
              flexDirection: "column",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
            },
            [breakpoints.up("md")]: {
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            },
          })}
        >
          <Stack
            direction="column"
            spacing="20px"
            width="500px"
            maxWidth="50%"
            sx={({ breakpoints }) => ({
              mr: "auto",
              [breakpoints.only("md")]: {
                mr: "75px",
              },
              [breakpoints.only("xl")]: {
                width: "500px",
                maxWidth: "40%",
              },
            })}
          >
            <VuiBox
              
              display="flex"
              width="220px"
              p="20px 22px"
              flexDirection="column"
              style={{ marginBottom:"90px" }}
              sx={({ breakpoints }) => ({
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                borderRadius: "20px",
                [breakpoints.up("xl")]: {
                  maxWidth: "110px !important",
                },
                [breakpoints.up("xxl")]: {
                  minWidth: "180px",
                  maxWidth: "100% !important",
                },
              })}
            >
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="5px">
                {data?.analyzed_metrics}
              </VuiTypography>
            </VuiBox>
            <VuiBox
              display="flex"
              width="220px"
              p="20px 22px"
              flexDirection="column"
              sx={({ breakpoints }) => ({
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                borderRadius: "20px",
                [breakpoints.up("xl")]: {
                  maxWidth: "110px !important",
                },
                [breakpoints.up("xxl")]: {
                  minWidth: "180px",
                  maxWidth: "100% !important",
                },
              })}
            >
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="5px">
                <span></span>Sentiment:<br/>
                {data?.sentiment_analysis}
              </VuiTypography>
              <VuiTypography color="white" variant="lg" fontWeight="bold" fontSize='small'>
                <span style={{ fontSize: "medium" }}></span>
              </VuiTypography>
            </VuiBox>
          </Stack>
          <VuiBox sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={data?.safety_score * 10} // Convert safety score to percentage
              disableShrink={true}
              size={window.innerWidth >= 1024 ? 200 : window.innerWidth >= 768 ? 170 : 200}
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
                  {data?.safety_score}
                </VuiTypography>
                <VuiTypography color="text" variant="button">
                  Total Score
                </VuiTypography>
              </VuiBox>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </Card>
  );
}
export default ReferralTracking;