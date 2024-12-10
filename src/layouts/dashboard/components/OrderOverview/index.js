// /*!

// =========================================================
// * Risk Protect AI React - v1.0.0
// =========================================================

// * Product Page: https://www.riskprotec.ai/product/riskprotect-ai
// * Copyright 2021 RiskProtec AI (https://www.riskprotec.ai/)
// * Licensed under MIT (https://github.com/riskprotectai/riskprotect-ai/blob/master LICENSE.md)

// * Design and Coded by Simmmple & RiskProtec AI

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */

import React, { useContext, useEffect, useState } from "react";
import { Card, Box, Divider } from "@mui/material";
import { FaArrowAltCircleUp, FaArrowCircleUp, FaArrowDown, FaArrowsAltH, FaArrowUp, FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa";
import VuiTypography from "components/VuiTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import VuiBox from "components/VuiBox";
import { AuthContext } from "context/Authcontext";
import axios from "axios";

const OrdersOverview = () => {
  const { stockData } = useContext(AuthContext);

  const [financialData, setFinancialData] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stockData?.symbol && stockData?.exchange) {
      const fetchFinancial = async () => {
        try {
          setLoading(true);
          const res_data = await axios.get(`https://rcapidev.neosme.co:2053/fund_info/${stockData.symbol || 'NSEI'}/${stockData.exchange || 'NSE'}`);
          setFinancialData(res_data.data);
        } catch (error) {
          console.error("Error fetching financial data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFinancial();
    }
  }, [stockData?.symbol, stockData?.exchange]);

  console.log('financialData', financialData);


  const formatNumber = (number, digits = 1) => {
    if (number >= 1e9) {
      return `${(number / 1e9).toFixed(digits)}B`;
    } else if (number >= 1e6) {
      return `${(number / 1e6).toFixed(digits)}M`;
    } else {
      return number?.toLocaleString();
    }
  };

  const getComparisonIcon = (current, previous) => {
    if (current && previous) {  // Check if both values exist
      if (current > previous) {
        return <FaArrowUp color="green" />;
      } else if (current < previous) {
        return <FaArrowDown color="red" />;
      }
    }
    return null;
  };

  // Filter out null entries and compare values with the previous quarter
  const processedData = financialData?.income_statement
    // ?.filter((item) => item.sales !== null && item.cost_of_goods !== null && item.net_income !== null)
    ?.sort((a, b) => new Date(b.fiscal_date) - new Date(a.fiscal_date)) // Sort by date descending
    ?.map((item, index, array) => {
      const next = array[index + 1]; // Compare with next item (previous quarter) since array is reversed
      return {
        ...item,
        comparison: {
          sales: getComparisonIcon(item.sales, next?.sales),
          cost_of_goods: getComparisonIcon(item.cost_of_goods, next?.cost_of_goods),
          gross_profit: getComparisonIcon(item.gross_profit, next?.gross_profit),
          operating_income: getComparisonIcon(item.operating_income, next?.operating_income),
          net_income: getComparisonIcon(item.net_income, next?.net_income),
          ebitda: getComparisonIcon(item.ebitda, next?.ebitda),
        },
      };
    });

  return (
    <Card className="h-100">
      <VuiBox mb="16px" display="flex" justifyContent="space-between">
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          Quarterly Results
        </VuiTypography>
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          {stockData?.symbol}
        </VuiTypography>
      </VuiBox>

      <VuiBox
        sx={{
          maxHeight: "420px",
          minHeight: "420px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
      >
        {processedData?.map((holder, index) => (
          (holder.sales || holder.cost_of_goods || holder.gross_profit || holder.operating_income || holder.net_income || holder.ebitda) &&
          ( // Ensure fiscal_date exists
            <React.Fragment key={index}>
              <TimelineItem
                icon={<FaCoins size="20px" color="white" />}
                title={
                  <VuiTypography
                    variant="subtitle1"
                    sx={{ fontSize: "15px", lineHeight: "1.2" }}
                    color="white"
                  >
                    {new Date(holder.fiscal_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </VuiTypography>
                }
                description={
                  <VuiBox sx={{ width: "100%" }}>
                    {holder.sales  && (
                      <VuiTypography
                        variant="body2"
                        sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                        color="white"
                      >
                        {`Total Revenue: ${formatNumber(holder.sales)} `}
                        {holder.comparison.sales}
                      </VuiTypography>
                    )}

                    {holder.cost_of_goods &&  (
                      <VuiTypography
                        variant="body2"
                        sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                        color="white"
                      >
                        {`Cost of Goods Sold: ${formatNumber(holder.cost_of_goods)} `}
                        {holder.comparison.cost_of_goods}
                      </VuiTypography>
                    )}

                    {holder.gross_profit && (
                      <VuiTypography
                        variant="body2"
                        sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                        color="white"
                      >
                        {`Gross Profit: ${formatNumber(holder.gross_profit)} `}
                        {holder.comparison.gross_profit}
                      </VuiTypography>
                    )}

                    {holder.operating_income && (
                      <VuiTypography
                        variant="body2"
                        sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                        color="white"
                      >
                        {`Operating Income: ${formatNumber(holder.operating_income)} `}
                        {holder.comparison.operating_income}
                      </VuiTypography>
                    )}

                    {holder.net_income &&  (
                      <VuiTypography
                        variant="body2"
                        sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                        color="white"
                      >
                        {`Net Income: ${formatNumber(holder.net_income)} `}
                        {holder.comparison.net_income}
                      </VuiTypography>
                    )}

                    {holder.ebitda && (
                      <VuiTypography
                        variant="body2"
                        sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                        color="white"
                      >
                        {`EBITDA: ${formatNumber(holder.ebitda)} `}
                        {holder.comparison.ebitda}
                      </VuiTypography>
                    )}
                  </VuiBox>
                }
              />
              {index < processedData.length - 1 && (
                <Divider
                  sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", marginY: "8px" }}
                />
              )}
            </React.Fragment>
          )
        ))}
      </VuiBox>
    </Card>
  );
};

export default OrdersOverview;


