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
import { FaArrowDown, FaArrowUp, FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa";
import VuiTypography from "components/VuiTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import VuiBox from "components/VuiBox";
import { AuthContext } from "context/Authcontext";
import { axiosInstance } from "SSL_disable";

const OrdersOverview = () => {
  const { stockData } = useContext(AuthContext);

  const [financialData, setFinancialData] = useState(
    {
      "meta": {
        "symbol": "AAPL",
        "name": "Apple Inc",
        "currency": "USD",
        "exchange": "NASDAQ",
        "mic_code": "XNGS",
        "exchange_timezone": "America/New_York"
      },
      "income_statement": [
        {
          "fiscal_date": "2024-09-30",
          "quarter": 2,
          "year": 2025,
          "sales": 642590000000,
          "cost_of_goods": 398840000000,
          "gross_profit": 243750000000,
          "operating_expense": {
            "research_and_development": null,
            "selling_general_and_administrative": null,
            "other_operating_expenses": 76440000000
          },
          "operating_income": 154650000000,
          "non_operating_interest": {
            "income": null,
            "expense": 1620000000
          },
          "other_income_expense": null,
          "pretax_income": 160320000000,
          "income_tax": 40770000000,
          "net_income": 119550000000,
          "eps_basic": 32.92,
          "eps_diluted": 32.92,
          "basic_shares_outstanding": 3617557716,
          "diluted_shares_outstanding": 3617557716,
          "ebit": 161940000000,
          "ebitda": 174600000000,
          "net_income_continuous_operations": 119550000000,
          "minority_interests": -460000000,
          "preferred_stock_dividends": 0
        },
        {
          "fiscal_date": "2024-03-31",
          "quarter": 4,
          "year": 2024,
          "sales": 612370000000,
          "cost_of_goods": 257370000000,
          "gross_profit": 355000000000,
          "operating_expense": {
            "research_and_development": null,
            "selling_general_and_administrative": null,
            "other_operating_expenses": -108210000000
          },
          "operating_income": 160320000000,
          "non_operating_interest": {
            "income": null,
            "expense": 2260000000
          },
          "other_income_expense": null,
          "pretax_income": 168490000000,
          "income_tax": 43470000000,
          "net_income": 125020000000,
          "eps_basic": null,
          "eps_diluted": null,
          "basic_shares_outstanding": null,
          "diluted_shares_outstanding": null,
          "ebit": 170750000000,
          "ebitda": 181090000000,
          "net_income_continuous_operations": null,
          "minority_interests": -680000000,
          "preferred_stock_dividends": 0
        },
        {
          "fiscal_date": "2023-12-31",
          "quarter": 3,
          "year": 2024,
          "sales": 605830000000,
          "cost_of_goods": 358950000000,
          "gross_profit": 246880000000,
          "operating_expense": {
            "research_and_development": null,
            "selling_general_and_administrative": null,
            "other_operating_expenses": 83000000000
          },
          "operating_income": 151550000000,
          "non_operating_interest": {
            "income": null,
            "expense": 2300000000
          },
          "other_income_expense": null,
          "pretax_income": 148290000000,
          "income_tax": 37320000000,
          "net_income": 110970000000,
          "eps_basic": 30.29,
          "eps_diluted": 30.29,
          "basic_shares_outstanding": 3650709805,
          "diluted_shares_outstanding": 3650709805,
          "ebit": 150590000000,
          "ebitda": 172500000000,
          "net_income_continuous_operations": null,
          "minority_interests": -390000000,
          "preferred_stock_dividends": 0
        },
        {
          "fiscal_date": "2023-09-30",
          "quarter": 2,
          "year": 2024,
          "sales": 596920000000,
          "cost_of_goods": 355850000000,
          "gross_profit": 241070000000,
          "operating_expense": {
            "research_and_development": null,
            "selling_general_and_administrative": 48350000000,
            "other_operating_expenses": 83610000000
          },
          "operating_income": 144830000000,
          "non_operating_interest": {
            "income": 8730000000,
            "expense": 1590000000
          },
          "other_income_expense": null,
          "pretax_income": 153300000000,
          "income_tax": 39500000000,
          "net_income": 113800000000,
          "eps_basic": 31,
          "eps_diluted": 31,
          "basic_shares_outstanding": 3658709677,
          "diluted_shares_outstanding": 3658709677,
          "ebit": 154890000000,
          "ebitda": 167520000000,
          "net_income_continuous_operations": 113800000000,
          "minority_interests": -380000000,
          "preferred_stock_dividends": 0
        },
        {
          "fiscal_date": "2023-06-30",
          "quarter": 1,
          "year": 2024,
          "sales": null,
          "cost_of_goods": null,
          "gross_profit": null,
          "operating_expense": {
            "research_and_development": null,
            "selling_general_and_administrative": null,
            "other_operating_expenses": null
          },
          "operating_income": null,
          "non_operating_interest": {
            "income": null,
            "expense": null
          },
          "other_income_expense": null,
          "pretax_income": null,
          "income_tax": 38690000000,
          "net_income": null,
          "eps_basic": 30.26,
          "eps_diluted": 30.26,
          "basic_shares_outstanding": 3659051373,
          "diluted_shares_outstanding": 3659051373,
          "ebit": null,
          "ebitda": null,
          "net_income_continuous_operations": null,
          "minority_interests": null,
          "preferred_stock_dividends": null
        }
      ]
    }
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stockData?.symbol && stockData?.exchange) {
      const fetchFinancial = async () => {
        try {
          setLoading(true);
          const res_data = await axiosInstance.get(`fund_info/${stockData.symbol}/${stockData.exchange}`);
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
    if (current > previous) {
      return <FaArrowUp color="green" />;
    } else if (current < previous) {
      return <FaArrowDown color="red" />;
    } else {
      return null;
    }
  };

  // Filter out null entries and compare values with the previous quarter
  const processedData = financialData?.income_statement
    ?.filter((item) => item.sales !== null && item.cost_of_goods !== null && item.net_income !== null)
    ?.map((item, index, array) => {
      const previous = array[index - 1] || {};
      return {
        ...item,
        comparison: {
          sales: getComparisonIcon(item?.sales, previous?.sales),
          cost_of_goods: getComparisonIcon(item?.cost_of_goods, previous?.cost_of_goods),
          gross_profit : getComparisonIcon(item?.gross_profit,previous?.gross_profit),
          operating_income : getComparisonIcon(item?.operating_income,previous?.operating_income),
          net_income: getComparisonIcon(item?.net_income, previous?.net_income),
          ebitda: getComparisonIcon(item?.ebitda, previous?.ebitda),
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
          <React.Fragment key={index}>
            <TimelineItem
              icon={<FaCoins size="20px" color="white" />}
              title={
                <VuiTypography
                  variant="subtitle1"
                  sx={{ fontSize: "15px", lineHeight: "1.2" }}
                  color="white"
                >
                  {`Quarter ${holder.quarter} - ${holder.year}`}
                </VuiTypography>
              }
              dateTime={
                <VuiTypography variant="caption" color="textSecondary">
                  Quarter Ending:{" "}
                  {new Date(holder.fiscal_date)?.toLocaleDateString()}
                </VuiTypography>
              }
              description={
                <VuiBox sx={{ width: "100%" }}>
                  <VuiTypography
                    variant="body2"
                    sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                    color="white"
                  >
                    Total Revenue: {formatNumber(holder.sales)}{" "}
                    {holder.comparison.sales}
                  </VuiTypography>
                  <VuiTypography
                    variant="body2"
                    sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                    color="white"
                  >
                    Cost of Goods Sold: {formatNumber(holder.cost_of_goods)}{" "}
                    {holder.comparison.cost_of_goods}
                  </VuiTypography>
                  <VuiTypography
                    variant="body2"
                    sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                    color="white"
                  >
                    Gross Profit: {formatNumber(holder.gross_profit)}{" "}
                    {holder.comparison.cost_of_goods}
                  </VuiTypography>
                  <VuiTypography
                    variant="body2"
                    sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                    color="white"
                  >
                    Operating Income: {formatNumber(holder.operating_income)}{" "}
                    {holder.comparison.cost_of_goods}
                  </VuiTypography>
                  <VuiTypography
                    variant="body2"
                    sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                    color="white"
                  >
                    Net Income: {formatNumber(holder.net_income)}{" "}
                    {holder.comparison.net_income}
                  </VuiTypography>
                  <VuiTypography
                    variant="body2"
                    sx={{ fontSize: "13px", lineHeight: "1.5", textAlign: "justify" }}
                    color="white"
                  >
                    EBITDA: {formatNumber(holder.ebitda)}{" "}
                    {holder.comparison.ebitda}
                  </VuiTypography>
                </VuiBox>
              }
            />
            {index < processedData.length - 1 && (
              <Divider
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", marginY: "8px" }}
              />
            )}
          </React.Fragment>
        ))}
      </VuiBox>
    </Card>
  );
};

export default OrdersOverview;


