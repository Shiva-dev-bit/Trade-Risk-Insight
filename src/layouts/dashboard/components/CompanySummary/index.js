import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Button } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { ReactTyped } from "react-typed";

const CompanyDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isReadyToExpand, setIsReadyToExpand] = useState(false);

  // Simulated API response as a string
  const staticData = {
    summary: "TCS operates in the Technology and IT services sector. Its recent stock price was INR 1823.7, close to its 52-week high of INR 11.46. The RSI of 55.70398 indicates the stock is neither overbought nor oversold. No recent news headlines about the stock were identified. MACD of -19.67755 suggests bearish sentiment in the short term."
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // Logic to show first 500 characters or full text based on expansion
    const textToDisplay = isExpanded 
      ? staticData.summary 
      : staticData.summary.slice(0, 200) + '...';
    
    setDisplayedText(textToDisplay);
  }, [isExpanded]);

  useEffect(() => {
    // Check if first two lines are fully typed
    const checkReadyToExpand = () => {
      // Simulate two-line generation by checking a reasonable character length
      if (displayedText.length >= 200) {
        setIsReadyToExpand(true);
      }
    };

    const timer = setTimeout(checkReadyToExpand, 4000); // Adjust timing to match typing speed

    return () => clearTimeout(timer);
  }, [displayedText]);

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
        {/* AI Icon */}
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
          <SmartToyOutlinedIcon style={{ fontSize: "42px", color: "white", marginRight: "10px" }} />
        </Box>
        
        {/* Direct String Display with Typing Effect */}
        <Box color="white" fontSize="16px" style={{color : "white"}}>
          <ReactTyped
            strings={[displayedText]}
            typeSpeed={50}
            backSpeed={0}
            loop={false}
            showCursor={false}
          />
        </Box>
        
        {/* Read More / Read Less Button */}
        {isReadyToExpand && staticData.summary.length > 300 && (
          <Box mt={1}>
            <Button
              variant="text"
              onClick={toggleExpand}
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: "14px",
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyDescription;