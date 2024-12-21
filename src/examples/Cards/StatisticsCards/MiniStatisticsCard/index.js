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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import React from 'react';
import { Card, Grid, Icon } from '@mui/material';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';


const MiniStatisticsCard = ({ title, count, percentage, icon, direction = "right" }) => {
  return (
    <Card className="h-full">
      <SoftBox p={2} className="h-full">
        <Grid container alignItems="center" spacing={2} className="h-full">
          {direction === "left" && (
            <Grid item>
              <SoftBox
                className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md bg-white"
              >
                <Icon fontSize="small" className="text-black">
                  {icon.component}
                </Icon>
              </SoftBox>
            </Grid>
          )}
          
          <Grid item xs className="min-w-0">
            <SoftBox lineHeight={1} className="space-y-1">
              {title && (
                <SoftTypography
                  className="text-sm font-medium text-black opacity-90"
                  style={title.sx}
                >
                  {title.text}
                </SoftTypography>
              )}
              
              <div className="flex flex-row gap-2">
                {count && (
                  <span className="text-lg font-bold text-black">
                    {count}
                  </span>
                )}
                
                {percentage && (
                    <SoftTypography
                      variant="button"
                      color={percentage.color}
                      style={{ 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        lineHeight: 1.5
                      }}
                    >
                      {typeof percentage.text === 'string' 
                        ? percentage.text
                        : React.Children.map(percentage.text.props.children, child => {
                            if (React.isValidElement(child) && child.type === 'span') {
                              return React.cloneElement(child, {
                                style: {
                                  ...child.props.style,
                                  // display: 'block',
                                  marginTop: '2px'
                                }
                              });
                            }
                            return child;
                          })
                      }
                    </SoftTypography>
                )}
              </div>
            </SoftBox>
          </Grid>

          {direction === "right" && (
            <Grid item>
              <SoftBox
                className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md bg-white"
              >
                <Icon fontSize="small" className="text-black">
                  {icon.component}
                </Icon>
              </SoftBox>
            </Grid>
          )}
        </Grid>
      </SoftBox>
    </Card>
  );
};


// Setting default values for the props of MiniStatisticsCard
MiniStatisticsCard.defaultProps = {
  bgColor: "white",
  title: {
    fontWeight: "medium",
    text: "",
  },
  percentage: {
    color: "success",
    text: "",
  },
  direction: "right",
};

// Typechecking props for the MiniStatisticsCard
MiniStatisticsCard.propTypes = {
  bgColor: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  title: PropTypes.shape({
    fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    text: PropTypes.string,
    sx: PropTypes.object, // Added sx prop validation
  }),
  count: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number,
    PropTypes.node // Added to support JSX elements
  ]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOfType([
      PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "white",
      ]),
      PropTypes.string // Added to support custom color values
    ]),
    text: PropTypes.oneOfType([
      PropTypes.string, 
      PropTypes.number,
      PropTypes.node // Added to support JSX elements
    ]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark"
    ]),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(["right", "left"]),
};

MiniStatisticsCard.defaultProps = {
  bgColor: "white",
  title: {
    fontWeight: "regular",
    text: "",
    sx: {}
  },
  percentage: {
    color: "success",
    text: "",
  },
  direction: "right"
};

export default MiniStatisticsCard;
