// @mui material components
import Tooltip from "@mui/material/Tooltip";

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiProgress from "components/VuiProgress";

// Images
import AdobeXD from "examples/Icons/AdobeXD";
import Atlassian from "examples/Icons/Atlassian";
import Slack from "examples/Icons/Slack";
import Spotify from "examples/Icons/Spotify";
import Jira from "examples/Icons/Jira";
import Invision from "examples/Icons/Invision";
import avatar1 from "assets/images/avatar1.png";
import avatar2 from "assets/images/avatar2.png";
import avatar3 from "assets/images/avatar3.png";
import avatar4 from "assets/images/avatar4.png";
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import Assessment from '@mui/icons-material/Assessment';
import { useContext, useEffect, useState } from "react";
import  axios  from "axios";
import { AuthContext } from "context/Authcontext";
import { format } from "date-fns";

export default function data() {
  const { stockData } = useContext(AuthContext);

  const [newsData,setNewsData] = useState([]);

  
  const fetchNews = async () => {
    const api = "https://rcapidev.neosme.co:2053/news/stock_and_general";
  
    try {
      const response = await axios.post(
        api,
        {
          stock_name: stockData?.company_name || "stock news",
        },
        {
          headers: { "Content-Type": "application/json" }, // Explicit header
        }
      );
      const data = response.data;
      console.log("News data received:", data, stockData?.company_name);
  
      if (data && data?.length > 0) {
        setNewsData(data);
      }
    } catch (error) {
      console.error("Fetch news error:", error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    fetchNews();
  }, [stockData?.company_name]);

  return {
    columns: [
      { name: "headline", align: "left" },
      { name: "datetime", align: "center" },
      { name: "sentiment", align: "center" },
    ],

    rows: newsData.map((item) => ({
      headline: (
        <>
          <VuiTypography variant="button" fontWeight="medium" color="white">
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              {item.headline.substring(0, 50)}
            </a>
          </VuiTypography>
          <VuiTypography variant="body2" color="white">
            <a href={item.link} style={{ color: "inherit" }}>{item.summary.substring(0, 50)}... </a>
          </VuiTypography>
        </>
      ),
      datetime: (
        <VuiTypography variant="caption" fontWeight="regular" color="white">
          {format(new Date(item.datePublished), "dd-MM-yyyy, HH:mm:ss")}
        </VuiTypography>
      ),
      sentiment: (
        <VuiTypography variant="button" fontWeight="bold" sx={{color: item.sentiment === "positive" ? "#24fc03" : (item.sentiment === "negative" ? "#db2c40" : "#f7a800")}}>
          {item.sentiment === "positive" ? "+" + item.confidence.toFixed(2) : (item.sentiment === "negative" ? "-" + item.confidence.toFixed(2) : item.confidence.toFixed(2))}
        </VuiTypography>
      ),
    })),
  };
  
}
