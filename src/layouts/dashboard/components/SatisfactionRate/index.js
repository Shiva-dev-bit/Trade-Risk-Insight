import React, { useEffect, useState } from "react";
import { Card, CircularProgress , CandlestickChartRoundedIcon} from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { IoHappy, IoSad,IoArrowUp, IoArrowForwardCircle } from "react-icons/io5";
import { FaArrowDownUpAcrossLine, FaArrowDownUpLock, FaArrowsUpDown, FaFaceSmile } from "react-icons/fa6";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { AuthContext } from "context/Authcontext";
import { useContext } from "react";
import { FaArrowsAlt, FaArrowsAltV } from "react-icons/fa";
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import  axios  from "axios";

const SatisfactionRate = () => {
  const { info, gradients } = colors;
  const { cardContent } = gradients;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const stockData = useContext(AuthContext);

  console.log('Volatility', data);
  // volatility/AXISBANK
  useEffect(() => {
    axios
      .get(`https://rcapidev.neosme.co:2053/volatility/${stockData?.stockData?.symbol || 'NSEI'}`)
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
    <Card sx={{ height: "100%" }}>
      <VuiBox display="flex" flexDirection="column" padding={2} sx={{ textAlign: 'center' }}>
        <VuiBox>
          <VuiTypography variant="h5" color="white" fontWeight="bold" mb="45px">
            <span style={{fontSize:'medium'}}>Volatility Score </span>
            <span style={{fontSize:'medium'}}> {stockData?.stockData?.symbol}</span>
          </VuiTypography>
        </VuiBox>
        <VuiBox sx={{ alignSelf: "center", justifySelf: "center", zIndex: "-1" ,mb:4}}>
          <VuiBox sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={(data?.volatility_score ?? 0) * 100}
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
                  // transform: "translateY(-0%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaArrowsAltV size="40px" color="#01b574" />
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
            <VuiTypography color="white" variant="h5">
              {(data?.volatility_score*100).toFixed(2)}%
            </VuiTypography>
            <VuiTypography color="text" variant="caption" fontWeight="regular" sx={{ fontSize: '10px' }}>
              Based on APARCH model volatility
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
