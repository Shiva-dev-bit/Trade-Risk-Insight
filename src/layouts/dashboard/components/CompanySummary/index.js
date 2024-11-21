import React, { useState, useEffect } from "react";
import { Card, CardContent, Box, Button } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest"; 
import Typewriter from "typewriter-effect";

const CompanyDescription = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [displayedText, setDisplayedText] = useState([]); 
  const [isExpanded, setIsExpanded] = useState(false); 

  const staticData = {
    summary: [
      `TCS operates in the Technology and IT services sector.`,
      `Its recent stock price was INR 1823.7, close to its 52-week high of INR 11.46.`,
      `The RSI of 55.70398 indicates the stock is neither overbought nor oversold.`,
      `No recent news headlines about the stock were identified.`,
      `MACD of -19.67755 suggests bearish sentiment in the short term.`,
    ],
  };

  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (currentIndex < staticData.summary.length && (isExpanded || currentIndex < 2)) {
      const timeout = setTimeout(() => {
        // Add the next sentence to the displayed list
        setDisplayedText((prevText) => [...prevText, staticData.summary[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 2000); // Delay for typing effect
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isExpanded]);

  const visibleText = isExpanded
    ? displayedText
    : displayedText.slice(0, 2); 

  return (
    <Card
      sx={{
        py: "20px",
        px: "24px",
        background: "linear-gradient(120deg, #191C57, #2B2E9B)", 
        color: "white",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        width: "100%", 
        overflow: "hidden",
      }}
    >
      <CardContent>
        {/* AI Icon */}
        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
          <SettingsSuggestIcon sx={{ fontSize: "32px", color: "white", mr: 1 }} />
        </Box>
        {/* Dotted List with Typewriter Effect */}
        <ul style={{ paddingLeft: "20px", color: "white", listStyleType: "disc" }}>
          {visibleText.map((line, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <Typewriter
                options={{
                  strings: [line],
                  autoStart: true,
                  delay: 30,
                  cursor: "_", // AI typing cursor effect
                  loop: false, // Ensure no repeated typing
                  deleteSpeed: 0, // Prevent deletion
                }}
              />
            </li>
          ))}
        </ul>
        {/* Read More / Read Less Button */}
        {staticData.summary.length > 2 && (
          <Box mt={2}>
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
