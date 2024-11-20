import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import VuiTypography from "components/VuiTypography";

const CompanyDescription = () => {
  const staticData = {
    summary: `Tata Consultancy Services Limited (TCS, NSE), a company in the Technology and IT services sector, recently had a stock price of INR 1823.7. It was at 11.45 INR recently, just around its 52-week high of 11.46. Over the past few days, there has been a slight decrease (0.08726%) in its daily stock price but the price is still well above its 52-week low of 9.02.

    Technical indicators (non-advocative metrics) are also important. The MACD of -19.67755 is slightly below the MACD signal of -47.90224. In simple terms, this could mean there's a bearish sentiment in the short term. The VWAP is at 4186.81657, similar to its current price, suggesting the stock might be fairly priced at the moment. An RSI of 55.70398 indicates that the stock is neither overbought nor oversold.

    Contextually, the financial metrics of TCS show a P/E ratio of 0.97, indicating its share price is in line with its earning capacity. Its net income is reported at 14.736 billion INR for Q4 2024, up from 21.448 billion from Q3 2024, suggesting TCS has had a good recent financial performance.

    No recent news headlines about the stock were identified. 
    Overall, the company's current stock performance, financial health, and technical indicators suggest stability but this analysis does not constitute investment advice.`,
  };

  const wrappedText = staticData.summary.substring(0, 500) + "...";

  return (
    <Card
      sx={{
        py: "32px",
        px: "24px",
        backgroundColor: "#1E1E2F", // Dark background
        color: "white", // Ensure text color is white
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        width: "100vw", // Full viewport width
        maxWidth: "100%", // Ensure responsiveness
        maxHeight: "500px",
        overflow: "hidden",
        margin: "0 auto", // Center horizontally
      }}
    >
      <CardContent>
        <Box mb={2}>
          {/* Title with reduced font size */}
          <VuiTypography
            variant="h6" // Use a smaller variant for the title
            fontWeight="bold"
            color="white"
            gutterBottom
          >
            Tata Consultancy Services (TCS) Stock Summary
          </VuiTypography>
        </Box>
        {/* Description with reduced font size */}
        <VuiTypography
          variant="body2" // Smaller font size for the description
          color="white"
          sx={{
            whiteSpace: "pre-line",
          }}
        >
          {wrappedText}
        </VuiTypography>
      </CardContent>
    </Card>
  );
};

export default CompanyDescription;
