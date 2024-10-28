import { useEffect, useState } from "react";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { MdDelete } from "react-icons/md";
import { supabase } from "lib/supabase";
import { Box, Button, Typography } from "@mui/material";

const StockList = ({ stocks, fetchUserStocks }) => {
  const {
    gradients: { card },
  } = colors;

  const deleteStock = async (portfolioId) => {
    const { error } = await supabase
      .from("userPortfolio")
      .update({ is_deleted_yn: true })
      .eq("portfolio_id", portfolioId);

    if (error) {
      console.error("Error deleting stock:", error);
    } else {
      fetchUserStocks();
    }
  };

  return (
    <Box
      sx={{
        background: linearGradient(card.main, card.state, card.deg),
        mb: 3.5,
        borderRadius: "15px",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography
          color="#fff"
          sx={{
            textTransform: "capitalize",
            mb: { xs: 3, sm: 4, md: 5 },
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          Stock Lists
        </Typography>
        <Button type="">+</Button>
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          p: 0,
          m: 0,
        }}
      >
        {stocks.map((stock) => (
          <Box
            key={stock.portfolio_id}
            component="li"
            sx={{
              mb: 3,
              p: 2,
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
              },
              color: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 3 },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              {/* Stock Name */}
              <Typography
                variant="button"
                color="white"
                fontWeight="medium"
                textTransform="capitalize"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  flexBasis: { sm: "30%" },
                }}
              >
                {stock?.stocks?.company_name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 3 },
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexGrow: 1,
                }}
              >
                <Typography variant="caption" color="text">
                  Quantity:{" "}
                  <Typography variant="caption" color="text" fontWeight="medium" component="span">
                    {stock.quantity}
                  </Typography>
                </Typography>

                <Typography variant="caption" color="text">
                  Average Price:{" "}
                  <Typography variant="caption" color="text" fontWeight="medium" component="span">
                    ₹{stock.average_price}
                  </Typography>
                </Typography>
              </Box>

              {/* Delete Button */}
              <Button
                variant="text"
                onClick={() => deleteStock(stock.portfolio_id)}
                sx={{
                  minWidth: "auto",
                  p: 1,
                  color: "#FF4040",
                  alignSelf: { xs: "flex-end", sm: "center" },
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    color: "#FF0000",
                  },
                  animation: "tilt-shaking 0.3s ease-in-out infinite",
                }}
              >
                <MdDelete size={20} />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StockList;
