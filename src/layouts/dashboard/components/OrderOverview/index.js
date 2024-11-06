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

import React, { useContext, useState } from "react";
import { Card, Box, Divider } from "@mui/material";
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa";
import VuiTypography from "components/VuiTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import VuiBox from "components/VuiBox";
import { AuthContext } from "context/Authcontext";

const OrdersOverview = () => {
  const { stockData } = useContext(AuthContext);

  const [financialData, setFinancialData] = useState([
    {
      "meta": {
        "symbol": "AAPL",
        "name": "Apple Inc",
        "currency": "USD",
        "exchange": "NASDAQ",
        "mic_code": "XNGS",
        "exchange_timezone": "America/New_York"
      },
      "fund_holders": [
        {
          "entity_name": "Vanguard Total Stock Market Index Fund",
          "date_reported": "2024-06-30",
          "shares": 460207907,
          "value": 102584946234,
          "percent_held": 0.030299999
        },
        {
          "entity_name": "Vanguard 500 Index Fund",
          "date_reported": "2024-06-30",
          "shares": 369945508,
          "value": 82464554543,
          "percent_held": 0.024300002
        },
        {
          "entity_name": "Fidelity 500 Index Fund",
          "date_reported": "2024-09-30",
          "shares": 186905417,
          "value": 41663087187,
          "percent_held": 0.0123000005
        },
        {
          "entity_name": "SPDR S&P 500 ETF Trust",
          "date_reported": "2024-09-30",
          "shares": 184097666,
          "value": 41037211402,
          "percent_held": 0.0121
        },
        {
          "entity_name": "iShares Core S&P 500 ETF",
          "date_reported": "2024-09-30",
          "shares": 165988147,
          "value": 37000418455,
          "percent_held": 0.0109
        },
      ]
    }
  ]);

  //   // const [loading, setLoading] = useState(false);

  //   // useEffect(() => {
  //   //   const fetchFinancial = async () => {
  //   //     if (stockData?.symbol) {
  //   //       try {
  //   //         const res_data = await axios.get(`https://1f2d-223-178-82-244.ngrok-free.app/company_finance/${stockData.symbol}`);
  //   //         setFinancialData(res_data.data);
  //   //       } catch (error) {
  //   //         console.error('Error fetching financial data:', error);
  //   //       } finally {
  //   //         setLoading(false);
  //   //       }
  //   //     }
  //   //   };
  //   //   console.log('financialData',financialData);

  //   //   fetchFinancial();
  //   // }, [stockData?.symbol]);

  const formatNumber = (number, digits = 1) => {
    if (number >= 1e9) {
      return `${(number / 1e9).toFixed(digits)}B`;
    } else if (number >= 1e6) {
      return `${(number / 1e6).toFixed(digits)}M`;
    } else {
      return number.toLocaleString();
    }
  };

  return (
    <Card className="h-100">
      <VuiBox mb="16px" display="flex" justifyContent="space-between">
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          Fund holders
        </VuiTypography>
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          {stockData?.symbol}
        </VuiTypography>
      </VuiBox>

      <VuiBox
        sx={{
          maxHeight: "420px",
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
        {financialData[0].fund_holders.map((holder, index) => (
          <React.Fragment key={index}>
            <TimelineItem
              icon={<FaCoins size="20px" color="white" />}
              title={
                <VuiTypography variant="subtitle1" sx={{ fontSize: '15px', lineHeight: '1.2' }} color="white">
                  {holder.entity_name}
                </VuiTypography>
              }
              dateTime={
                <VuiTypography variant="caption" color="textSecondary">
                  Reported on: {new Date(holder.date_reported).toLocaleDateString()}
                </VuiTypography>
              }
              description={
                <VuiBox sx={{ width: '100%' }}>
                  <VuiTypography variant="body2" sx={{ fontSize: '13px', lineHeight: '1.5', textAlign: 'justify' }} color="white">
                    Shares: {formatNumber(holder.shares)}
                  </VuiTypography>
                  <VuiTypography variant="body2" sx={{ fontSize: '13px', lineHeight: '1.5', textAlign: 'justify' }} color="white">
                    Value: {formatNumber(holder.value)}
                  </VuiTypography>
                  <VuiTypography variant="body2" sx={{ fontSize: '13px', lineHeight: '1.5', textAlign: 'justify' }} color="white">
                    % Held: {(holder.percent_held * 100).toFixed(1)}%
                  </VuiTypography>
                </VuiBox>
              }
            />
            {/* Add a divider between items */}
            {index < financialData[0].fund_holders.length - 1 && (
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', marginY: '8px' }} />
            )}
          </React.Fragment>
        ))}


      </VuiBox>
    </Card>
  );
};

export default OrdersOverview;


