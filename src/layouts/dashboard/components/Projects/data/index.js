// @mui material components
import Tooltip from "@mui/material/Tooltip";

// UI Risk LENS AI Dashboard React components
import SoftBox from "/src/components/SoftBox";
import SoftTypography from "/src/components/SoftTypography";
import SoftAvatar from "/src/components/SoftAvatar";
import SoftProgress from "/src/components/SoftProgress";

// Images
import { useContext, useEffect, useState } from "react";
import  axios  from "axios";
import { AuthContext } from "/src/context/Authcontext";
import { format } from "date-fns";

export default function data() {
  const { stockData } = useContext(AuthContext);

  const [newsData,setNewsData] = useState([]);

  
  const fetchNews = async () => {
    setNewsData([]);
    
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
          <SoftTypography variant="button" fontWeight="medium" color="black">
            <a href={item.link} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              {item.headline.substring(0, 50)}
            </a>
          </SoftTypography>
          <SoftTypography variant="body2" color="black">
            <a href={item.link} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>{item.summary.substring(0, 50)}... </a>
          </SoftTypography>
        </>
      ),
      datetime: (
        <SoftTypography variant="caption" fontWeight="regular" color="black">
          {format(new Date(item.datePublished), "dd-MM-yyyy, HH:mm:ss")}
        </SoftTypography>
      ),
      sentiment: (
        <SoftTypography variant="button" fontWeight="bold" sx={{color: item.sentiment === "positive" ? "#24fc03" : (item.sentiment === "negative" ? "#db2c40" : "#f7a800")}}>
          {item.sentiment === "positive" ? "+" + item.confidence.toFixed(2) : (item.sentiment === "negative" ? "-" + item.confidence.toFixed(2) : item.confidence.toFixed(2))}
        </SoftTypography>
      ),
    })),
  };
  
}
