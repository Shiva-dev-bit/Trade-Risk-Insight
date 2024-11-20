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
    let api = 'https://172.235.16.92:8000/news/general';
    if(stockData?.company_name){
      api = `https://172.235.16.92:8000/news/stock/${stockData?.company_name}`;
    }
   
    try {
      const response = await axios.get(api);
      const data = response.data;

      if (data && data.news.length > 0) {
        setNewsData(data);
        console.log("News data", data);
      } else{
        console.log("No news data");
        api = `https://172.235.16.92:8000/news/stock/${stockData?.symbol}`;
        const response = await axios.get(api);
        const data = response.data;

        setNewsData(data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [stockData?.symbol]);

  return {
    columns: [
      { name: "headline", align: "left" },
      { name: "datetime", align: "center" },
      { name: "sentiment", align: "center" },
    ],
  
    rows: newsData?.news?.map((item) => ({
      headline: (
        <>
          <VuiTypography variant="button" fontWeight="medium" color="white">
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              {item.title.substring(0, 50)}
            </a>
          </VuiTypography>
          <VuiTypography variant="body2" color="white">
            <a href={item.url} style={{ color: "inherit" }}>{item.text.substring(0, 50)}... </a>
          </VuiTypography>
        </>
      ),
      datetime: (
        <VuiTypography variant="caption" fontWeight="regular" color="white">
          {format(new Date(item.publish_date), "dd-MM-yyyy,' 'HH:mm:ss")}
        </VuiTypography>
      ),
      sentiment: (
        <VuiTypography variant="button" fontWeight="bold" sx={{color : item.sentiment > 0 ? "#24fc03" : "#db2c40"}}>
          {item.sentiment > 0 ? '+'+item.sentiment : item.sentiment}
        </VuiTypography>
      ),
    })),
  };
  
}
