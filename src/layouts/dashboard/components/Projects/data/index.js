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
import axios from "axios";
import { AuthContext } from "context/Authcontext";

export default function data() {
  const { stockData } = useContext(AuthContext);
  console.log('search stockData' , stockData);


  const avatars = (members) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placeholder="bottom">
        <VuiAvatar
          src={image}
          alt="name"
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { dark } }) =>
              `${borderWidth[2]} solid ${dark.focus}`,
            cursor: "pointer",
            position: "relative",

            "&:not(:first-of-type)": {
              ml: -1.25,
            },

            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));


  const [newsData,setNewsData] = useState([]);

  
  const fetchNews = async () => {
    const api = `https://4fdf-223-178-80-57.ngrok-free.app/news/${stockData?.symbol}`;
    try {
      const response = await axios.get(api);
      const data = response.data;

      if (data) {
        setNewsData(data);
        console.log("News data", data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (stockData?.symbol) {
      fetchNews();
    }
  }, [stockData?.symbol]);

  console.log('newsData',newsData);

  // const data = [
  //   {
  //     company: "GLAXO",
  //     title: "Donegal-based TCS Signs 15 year Deal for Ireland’s new pension scheme",
  //     url: "https://www.donegaldaily.com/2024/10/29/donegal-based-tcs-signs-15-year-deal-for-irelands-new-pension-scheme-1/",
  //     text: "Donegal-based Tata Consultancy Services (TCS) has secured a 15-year contract...",
  //     publish_date: "40 minutes ago",
  //     category: "CAPITAL MARKET - LIVE",
  //     sentiment: 0.509,
  //   },
  //   // Add more items as needed
  // ];


  return {
    columns: [
      { name: "company", align: "left" },
      { name: "headline", align: "left" },
      { name: "time", align: "center" },
      { name: "category", align: "center" },
      { name: "sentiment", align: "center" },
    ],
  
    rows: newsData?.news?.map((item) => ({
      company: (
        <VuiBox display="flex" alignItems="center">
          <TrendingDown style={{ color: item.sentiment < 0 ? "red" : "green", marginRight: "8px" }} />
          <VuiTypography variant="button" fontWeight="medium" color="white">
            {stockData?.symbol}
          </VuiTypography>
        </VuiBox>
      ),
      headline: (
        <div>
          <VuiTypography variant="button" fontWeight="medium" color="white">
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              {item.title.substring(0, 60)}
            </a>
          </VuiTypography>
          <VuiTypography variant="body2" color="white">
            <a href={item.url} style={{ color: "inherit" }}>{item.text.substring(0, 50)}... </a>
          </VuiTypography>
        </div>
      ),
      time: (
        <VuiTypography variant="caption" fontWeight="regular" color="white">
          {item.publish_date}
        </VuiTypography>
      ),
      category: (
        <VuiTypography variant="button" fontWeight="bold" color="white">
          {item.category}
        </VuiTypography>
      ),
      sentiment: (
        <VuiTypography variant="button" fontWeight="bold" color={item.sentiment > 0 ? "green" : "red"}>
          {item.sentiment.toFixed(2)}
        </VuiTypography>
      ),
    })),
  };
  
}
