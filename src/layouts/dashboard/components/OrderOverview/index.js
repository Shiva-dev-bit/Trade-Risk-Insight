/**
=========================================================
* RiskCompass AI React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Icon from "@mui/material/Icon";

// RiskCompass AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// RiskCompass AI React examples
import React, { useContext, useEffect, useState } from "react";
import { Card, Box, Divider } from "@mui/material";
import { FaArrowAltCircleUp, FaArrowCircleUp, FaArrowDown, FaArrowsAltH, FaArrowUp, FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa";
import TimelineItem from "examples/Timeline/TimelineItem";
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
    <Card className="h-100" style={{ padding: '14px' }}>
      <SoftBox mb="16px" display="flex" justifyContent="space-between">
        <SoftTypography variant="lg" fontWeight="bold" mb="5px" color="black">
          Quarterly Results
        </SoftTypography>
        <SoftTypography
          variant="lg"
          fontWeight="bold"
          mb="5px"
          color="black"
          sx={{ fontSize: "14px" }}
        >
          {stockData?.symbol}
        </SoftTypography>

      </SoftBox>

      <SoftBox
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
        {processedData?.map(
          (holder, index) =>
            (holder.sales ||
              holder.cost_of_goods ||
              holder.gross_profit ||
              holder.operating_income ||
              holder.net_income ||
              holder.ebitda) &&
            holder.fiscal_date && ( // Ensure fiscal_date exists
              <React.Fragment key={index}>
                <TimelineItem
                  icon={<FaCoins size="20px" color="black" />}
                  title={
                    <SoftTypography
                      variant="subtitle1"
                      sx={{ fontSize: "15px", lineHeight: "1.2" }}
                      color="black"
                    >
                      {new Date(holder.fiscal_date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </SoftTypography>
                  }
                  description={
                    <SoftBox sx={{ width: "100%" }}>
                      {holder.sales && (
                        <SoftTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                          color="black"
                        >
                          {`Total Revenue: ${formatNumber(holder.sales)} `}
                          {holder.comparison.sales}
                        </SoftTypography>
                      )}

                      {holder.cost_of_goods && (
                        <SoftTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                          color="black"
                        >
                          {`Cost of Goods Sold: ${formatNumber(
                            holder.cost_of_goods
                          )} `}
                          {holder.comparison.cost_of_goods}
                        </SoftTypography>
                      )}

                      {holder.gross_profit && (
                        <SoftTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                          color="black"
                        >
                          {`Gross Profit: ${formatNumber(holder.gross_profit)} `}
                          {holder.comparison.gross_profit}
                        </SoftTypography>
                      )}

                      {holder.operating_income && (
                        <SoftTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                          color="black"
                        >
                          {`Operating Income: ${formatNumber(
                            holder.operating_income
                          )} `}
                          {holder.comparison.operating_income}
                        </SoftTypography>
                      )}

                      {holder.net_income && (
                        <SoftTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                          color="black"
                        >
                          {`Net Income: ${formatNumber(holder.net_income)} `}
                          {holder.comparison.net_income}
                        </SoftTypography>
                      )}

                      {holder.ebitda && (
                        <SoftTypography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                          color="black"
                        >
                          {`EBITDA: ${formatNumber(holder.ebitda)} `}
                          {holder.comparison.ebitda}
                        </SoftTypography>
                      )}
                    </SoftBox>
                  }
                />
                {index < processedData.length - 1 && (
                  <Divider
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      marginY: "8px",
                    }}
                  />
                )}
              </React.Fragment>
            )
        )}
      </SoftBox>
    </Card>

  );
};

export default OrdersOverview;
