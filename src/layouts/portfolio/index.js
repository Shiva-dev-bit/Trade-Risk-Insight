import { Box, Button, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import { supabase } from "lib/supabase";
import React, { useEffect, useState } from "react";
import StockList from "./components/StockList";

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const userId = 1;

  const fetchUserStocks = async () => {
    const { data, error } = await supabase
      .from("userPortfolio")
      .select("portfolio_id, stock_id, quantity, average_price, is_deleted_yn, stocks(*), users(*)")
      .eq("user_id", userId)
      .eq("is_deleted_yn", false);

    if (error) {
      console.error("Error fetching stocks:", error);
    } else {
      setStocks(data);
    }
  };

  useEffect(() => {
    fetchUserStocks();
  }, []);
  return (
    <DashboardLayout>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Header username={stocks[0]?.users?.username} email={stocks[0]?.users?.email} />
          <StockList stocks={stocks} fetchUserStocks={fetchUserStocks} />
      </Box>
    </DashboardLayout>
  );
};

export default Portfolio;
