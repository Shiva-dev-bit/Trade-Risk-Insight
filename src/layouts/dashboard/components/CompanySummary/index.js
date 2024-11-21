import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Button } from "@mui/material";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { ReactTyped } from "react-typed";

const CompanyDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isReadyToExpand, setIsReadyToExpand] = useState(false);
  

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
    if (isExpanded) {
      // When collapsing, reset to first two lines without regenerating
      setDisplayedLines(staticData.summary.slice(0, 2));
      setCurrentLineIndex(2);
      setIsExpanded(false);
    } else {
      // When expanding, start typing additional lines
      setIsExpanded(true);
      setCurrentLineIndex(2); // Start from third line when expanding
    }
  };

  useEffect(() => {
    // Stop at 2 lines if not expanded, continue if expanded
    const maxLines = isExpanded ? staticData.summary.length : 2;

    if (currentLineIndex < maxLines) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, staticData.summary[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);

        // Check if we've completed the first two lines
        if (currentLineIndex === 1) {
          setIsReadyToExpand(true);
        }
      }, 2000); // 2 second delay between lines

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, isExpanded]);

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
        
        {/* Dotted List with Sequential Typing */}
        <ul style={{ paddingLeft: "20px", color: "white", listStyleType: "disc", fontSize: "16px" }}>
          {displayedLines.map((line, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>
              <ReactTyped
                strings={[line]}
                typeSpeed={50}
                backSpeed={0}
                loop={false}
                showCursor={false}
              />
            </li>
          ))}
        </ul>
        
        {/* Read More / Read Less Button */}
        {staticData.summary.length > 2 && isReadyToExpand && (
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