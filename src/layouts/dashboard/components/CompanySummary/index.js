import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Box, Button, Typography, Link } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { ReactTyped } from "react-typed";
import axios from "axios";
import { AuthContext } from "context/Authcontext";
import './style.css'

const CompanyDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialTypingComplete, setIsInitialTypingComplete] = useState(false);
  const [summary, setSummary] = useState(
    "The Nifty 50 index closed at 24,620.50 on December 10, 2024, reflecting a marginal increase of 1.50 points (0.00609%) from the previous close of 24,619.00. During the trading session, the index fluctuated between a low of 24,511.85 and a high of 24,677.75, with a substantial trading volume of approximately 260.94 million shares. Notably, the 52-week range for Nifty 50 shows considerable volatility, having ranged from a low of 20,769.50 to a high of 26,277.35, indicating potential for movement. Technical indicators reveal a mixed outlook: the MACD suggests a buy signal while the SMA also indicates a buy, although the RSI and VWAP suggest sell signals, reflecting market indecision. Recent news highlights concerns about the broader market sentiment, as analysts emphasize key support levels at 24,550 and caution regarding inflation impacts and economic indicators. Overall, while there are signs of strength, market performance remains cautiously optimistic amid mixed signals and global economic challenges."
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

  const initialText = summary; // First two lines (approx)
  const remainingText = summary.slice(initialText.length);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <Card
      sx={{
        background : 'white',
        borderRadius: "12px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        width: "100%",
        overflow: "hidden",
        fontWeight : '500',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        color: "rgb(103, 116, 142)"
      }}
    >
      <CardContent sx={{ padding: '15px'}}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* AI Icon and Text Content Container */}
          <Box>
            <SmartToyOutlinedIcon style={{ fontSize: "42px" }} />
          </Box>

          {/* Text Content */}
          <Box fontSize="16px" sx={{ flex: 1 }}>
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
                {!isExpanded && !initialText && <span className="animated-ellipsis"></span>}
              </>
            )}
          </Box>
        </Box>
        {/* Read More / Read Less Button */}
        {/* {isInitialTypingComplete && remainingText && (
          <Box style={{ marginLeft : '10px'}}>
            <Button
              variant="text"
              onClick={toggleExpand}
              sx={{
                textTransform: "none",
                fontSize: "14px",
                padding: "0",
                minWidth: "auto",
                marginLeft : '15px'
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          </Box>
        )} */}
        {/* terms and conditions */}
      </CardContent>
      {isInitialTypingComplete && (
      <Box
      sx={{
        position: "absolute",
        bottom: "-20px",
        right: "0",
        paddingRight: "30px",
        paddingBottom: "15px",
      }} 
      >
        <Typography fontWeight="regular" sx={{ fontSize: '11px' }}>
          <span style={{ color: '#b4b4b4' }}> *For investor education purposes only.</span>
          <span style={{ fontWeight: 'bold' }}><Link href="https://privacy.microsoft.com/en-us/privacystatement" target='_blank' sx={{ color: '#b4b4b4' }}>Terms and Conditions</Link></span>

        </Typography>
      </Box>
      )}
    </Card>
  );
};

export default CompanyDescription;
