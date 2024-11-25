import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Box, Button } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { ReactTyped } from "react-typed";
import axios from "axios";
import { AuthContext } from "context/Authcontext";

const CompanyDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialTypingComplete, setIsInitialTypingComplete] = useState(false);
  const [summary, setSummary] = useState(
    "TCS operates in the Technology and IT services sector. Its recent stock price was INR 1823.7, close to its 52-week high of INR 11.46. The RSI of 55.70398 indicates the stock is neither overbought nor oversold. No recent news headlines about the stock were identified. MACD of -19.67755 suggests bearish sentiment in the short term."
  );
  const { stockData } = useContext(AuthContext);

  const fetchSummary = async () => {
    try {
      setSummary(""); // Empty summary while waiting for new data
      setIsInitialTypingComplete(false); // Reset the typing effect

      const response = await axios.post(
        "https://rcapidev.neosme.co:2053/generate-stock-summary",
        {
          stock_symbol: stockData?.symbol,
          exchange: stockData?.exchange,
          stock_name: stockData?.company_name,
        }
      );
      if (response.data?.summary) {
        setSummary(response.data.summary);
        setIsInitialTypingComplete(false); // Restart typing effect
      } else {
        console.error("Summary not found in response");
      }
    } catch (error) {
      console.error("Error fetching stock summary:", error);
    }
  };

  useEffect(() => {
    if (stockData?.symbol && stockData?.exchange && stockData?.company_name) {
      fetchSummary();
    }
  }, [stockData?.symbol, stockData?.exchange, stockData?.company_name]);

  const initialText = summary.split(" ").slice(0, 40).join(" "); // First two lines (approx)
  const remainingText = summary.slice(initialText.length);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      sx={{
        py: "10px",
        px: "14px",
        background: "radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(7,27,133,1) 96%, rgba(0,212,255,1) 100%)",
        color: "white",
        borderRadius: "12px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        width: "100%",
        overflow: "hidden",
        fontFamily: "'Roboto Mono', monospace",
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* AI Icon and Text Content Container */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <SmartToyOutlinedIcon style={{ fontSize: "42px", color: "white" }} />

            {/* Text Content */}
            <Box style={{ color: "white" }} fontSize="16px" sx={{ flex: 1 }}>
              {/* Initial Typing Effect */}
              {!isInitialTypingComplete && (
                <ReactTyped
                  strings={[initialText]}
                  typeSpeed={0}
                  backSpeed={0}
                  loop={false}
                  showCursor={false}
                  onComplete={() => setIsInitialTypingComplete(true)}
                />
              )}

              {/* Display Initial Text and Remaining Text */}
              {isInitialTypingComplete && (
                <>
                  {initialText}
                  {isExpanded && remainingText}
                  {!isExpanded && " ..."}
                </>
              )}
            </Box>
          </Box>

          {/* Read More / Read Less Button */}
          {isInitialTypingComplete && remainingText && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: '35px' }}>
              <Button
                variant="text"
                onClick={toggleExpand}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "14px",
                  padding: "0",
                  minWidth: "auto",
                }}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyDescription;
