import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CircularProgress } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { IoHappy, IoSad } from "react-icons/io5";
import { FaFaceSmile } from "react-icons/fa6";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";

const SatisfactionRate = () => {
  const { info, gradients } = colors;
  const { cardContent } = gradients;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://8fc9-223-178-85-213.ngrok-free.app/volatility/TCS")
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  // const { summary, symbol } = data;
  const summary = "",
    symbol = "";
  const satisfactionRate = 5;

  return (
    <Card sx={{ height: "100%" }}>
      <VuiBox display="flex" flexDirection="column" padding={2}>
        <VuiTypography variant="h5" color="white" fontWeight="bold" mb="10px">
          {/* {symbol}  */}
          Volatility Score
        </VuiTypography>
        <VuiBox display="flex" justifyContent="space-between" mb={3}>
          <VuiBox>
            <VuiTypography variant="h6" color="white">
              Current Price: ${summary?.current_price?.toFixed(2)}
            </VuiTypography>
            <VuiTypography variant="body2" color="white">
              Change: ${summary?.price_change?.toFixed(2)} (
              {summary?.price_change_percent?.toFixed(2)}%)
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox sx={{ alignSelf: "center", justifySelf: "center", zIndex: "-1" }}>
          <VuiBox sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={satisfactionRate}
              size={150}
              color="info"
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
                sx={{
                  background: info.main,
                  // transform: "translateY(-0%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {satisfactionRate > 50 ? (
                  <IoHappy size="30px" color="#ffac33" />
                ) : (
                  <IoSad size="30px" color="#ffac33" />
                )} */}

                {satisfactionRate === 50 ? (
                  <FaFaceSmile size="26px" color="#fff" />
                ) : satisfactionRate > 50 ? (
                  <IoHappy size="30px" color="#fff" />
                ) : (
                  <IoSad size="30px" color="#fff" />
                )}
              </VuiBox>
            </VuiBox>
          </VuiBox>
        </VuiBox>
        <VuiBox
          sx={({ breakpoints }) => ({
            width: "90%",
            padding: "18px 22px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            height: "82px",
            mx: "auto",
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            transform: "translateY(10%)",
            zIndex: "1000",
          })}
        >
          <VuiTypography color="text" variant="caption" display="inline-block" fontWeight="regular">
            0%
          </VuiTypography>
          <VuiBox
            flexDirection="column"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ minWidth: "80px" }}
          >
            <VuiTypography color="white" variant="h3">
              {satisfactionRate}%
            </VuiTypography>
            <VuiTypography color="text" variant="caption" fontWeight="regular">
              Based on likes
            </VuiTypography>
          </VuiBox>
          <VuiTypography color="text" variant="caption" display="inline-block" fontWeight="regular">
            100%
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default SatisfactionRate;
