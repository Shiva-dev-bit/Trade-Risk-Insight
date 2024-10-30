import { Box, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const StockPrice = ({ symbol, mic_code, percent_change, close, source }) => {
  const [priceData, setPriceData] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPriceData(close || null);
    setPercentageChange(percent_change ? parseFloat(percent_change) : null);
    setIsLoading(false);
  }, [symbol, mic_code, close, percent_change, source]);

  const formattedPrice = useMemo(() => {
    if (priceData === null) return "--";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceData);
  }, [priceData]);

  if (isLoading) return <Typography></Typography>;

  const color = percentageChange >= 0 ? "#4CAF50" : "#FF5252";

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Typography sx={{ color: "white", fontSize: "16px" }}>{formattedPrice}</Typography>
      {percentageChange !== null && (
        <Typography
          sx={{
            color,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {percentageChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
          {Math.abs(percentageChange).toFixed(2)}%
        </Typography>
      )}
    </Box>
  );
};

export default StockPrice;
