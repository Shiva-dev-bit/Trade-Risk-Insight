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
import SoftBox from '/src/components/SoftBox';
import SoftTypography from '/src/components/SoftTypography';


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
            <Grid >
              <SoftBox
              >
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    marginLeft: "auto",
                    display: "flex",
                    WebkitBoxPack: "center",
                    justifyContent: "center",
                    WebkitBoxAlign: "center",
                    alignItems: "center",
                    opacity: 1,
                    background: "linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))",
                    color: "rgb(255, 255, 255)",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "rgba(20, 20, 20, 0.12) 0rem 0.25rem 0.375rem -0.0625rem, rgba(20, 20, 20, 0.07) 0rem 0.125rem 0.25rem -0.0625rem",
                  }}>
                  {icon.component}
                </div>
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
