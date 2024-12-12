/*!

=========================================================
* Risk Protect AI React - v1.0.0
=========================================================

* Product Page: https://www.riskprotec.ai/product/riskprotect-ai
* Copyright 2021 RiskProtec AI (https://www.riskprotec.ai/)
* Licensed under MIT (https://github.com/riskprotectai/riskprotect-ai/blob/master LICENSE.md)

* Design and Coded by Simmmple & RiskProtec AI

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useMemo, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// uuid is a library for generating unique id
import { v4 as uuidv4 } from "uuid";

// @mui material components
import { Table as MuiTable, Button } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// UI Risk LENS AI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiAvatar from "components/VuiAvatar";
import VuiTypography from "components/VuiTypography";

// UI Risk LENS AI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

function Table({
  columns,
  rows,
  pagination = false,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 10
}) {
  const { grey, primary } = colors;
  const { size = {}, fontWeightBold } = typography || {};
  const { borderWidth } = borders;

  // Fallback to a default size if undefined
  const fontSize = size.xxs || '0.75rem';

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Handle page change
  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const renderColumns = columns.map(({ name, align, width }, key) => {
    let pl;
    let pr;

    if (key === 0) {
      pl = 3;
      pr = 3;
    } else if (key === columns.length - 1) {
      pl = 3;
      pr = 3;
    } else {
      pl = 1;
      pr = 1;
    }

    return (
      <VuiBox
        key={name}
        component="th"
        width={width || "auto"}
        pt={1.5}
        pb={1.25}
        pl={align === "left" ? pl : 3}
        pr={align === "right" ? pr : 3}
        textAlign={align}
        fontSize={fontSize}
        fontWeight={fontWeightBold}
        color="text"
        opacity={0.7}
        borderBottom={`${borderWidth[1]} solid ${grey[700]}`}
      >
        {name.toUpperCase()}
      </VuiBox>
    );
  });

  // Determine rows to render
  const renderRows = pagination
    ? useMemo(() =>
      rows
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, key) => {
          const rowKey = `row-${key}`;

          const tableRow = columns.map(({ name, align }) => {
            let template;

            if (Array.isArray(row[name])) {
              template = (
                <VuiBox
                  key={uuidv4()}
                  component="td"
                  p={1}
                  borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${grey[700]}` : null}
                >
                  <VuiBox display="flex" alignItems="center" py={0.5} px={1}>
                    <VuiBox mr={2}>
                      <VuiAvatar src={row[name][0]} name={row[name][1]} variant="rounded" size="sm" />
                    </VuiBox>
                    <VuiTypography
                      color="white"
                      variant="button"
                      fontWeight="medium"
                      sx={{ width: "max-content" }}
                    >
                      {row[name][1]}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
              );
            } else {
              template = (
                <VuiBox
                  key={uuidv4()}
                  component="td"
                  p={1}
                  textAlign={align}
                  borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${grey[700]}` : null}
                >
                  <VuiTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    sx={{ display: "inline-block", width: "max-content" }}
                  >
                    {row[name]}
                  </VuiTypography>
                </VuiBox>
              );
            }

            return template;
          });

          return <TableRow key={rowKey}>{tableRow}</TableRow>;
        })
      , [page, rowsPerPage, rows, columns])
    : rows.map((row, key) => {
      const rowKey = `row-${key}`;

      const tableRow = columns.map(({ name, align }) => {
        let template;

        if (Array.isArray(row[name])) {
          template = (
            <VuiBox
              key={uuidv4()}
              component="td"
              p={1}
              borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${grey[700]}` : null}
            >
              <VuiBox display="flex" alignItems="center" py={0.5} px={1}>
                <VuiBox mr={2}>
                  <VuiAvatar src={row[name][0]} name={row[name][1]} variant="rounded" size="sm" />
                </VuiBox>
                <VuiTypography
                  color="white"
                  variant="button"
                  fontWeight="medium"
                  sx={{ width: "max-content" }}
                >
                  {row[name][1]}
                </VuiTypography>
              </VuiBox>
            </VuiBox>
          );
        } else {
          template = (
            <VuiBox
              key={uuidv4()}
              component="td"
              p={1}
              textAlign={align}
              borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${grey[700]}` : null}
            >
              <VuiTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ display: "inline-block", width: "max-content" }}
              >
                {row[name]}
              </VuiTypography>
            </VuiBox>
          );
        }

        return template;
      });

      return <TableRow key={rowKey}>{tableRow}</TableRow>;
    });

  // Custom pagination controls
  const renderPaginationControls = () => (
    <VuiBox
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      px={2}
    >
      {/* Rows per page selector */}
      <VuiBox display="flex" alignItems="center">
        <VuiTypography variant="caption" color="text" mr={1}>
          Rows per page:
        </VuiTypography>
        <select
          value={rowsPerPage}
          onChange={(e) => handleChangeRowsPerPage(e)}
          style={{
            backgroundColor: grey[800],
            color: 'white',
            border: `1px solid ${grey[700]}`,
            borderRadius: '4px',
            padding: '4px'
          }}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </VuiBox>

      {/* Page navigation */}
      <VuiBox display="flex" alignItems="center">
        <VuiTypography variant="caption" color="text" mr={2}>
          {`Page ${page + 1} of ${totalPages}`}
        </VuiTypography>

        <Button
          variant="contained"
          color="primary"
          disabled={page === 0}
          onClick={() => handleChangePage(page - 1)}
          sx={{
            minWidth: '40px',
            height: '40px',
            mr: 1,
            backgroundColor: page === 0 ? grey[700] : primary.main,
            '&:hover': {
              backgroundColor: page === 0 ? grey[700] : primary.focus
            }
          }}
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={page === totalPages - 1}
          onClick={() => handleChangePage(page + 1)}
          sx={{
            minWidth: '40px',
            height: '40px',
            backgroundColor: page === totalPages - 1 ? grey[700] : primary.main,
            '&:hover': {
              backgroundColor: page === totalPages - 1 ? grey[700] : primary.focus
            }
          }}
        >
          <ChevronRightIcon />
        </Button>
      </VuiBox>
    </VuiBox>
  );

  return (
    <VuiBox>
      <TableContainer
        sx={{
          overflowX: 'hidden', // Prevent horizontal scrolling
          "& thead th": {
            padding: "8px", // Reduce padding in header cells
            fontSize: "0.65rem", // Smaller font size
          },
          "& tbody td": {
            padding: "6px", // Reduce padding in body cells
            fontSize: "0.875rem", // Smaller font size
            whiteSpace: "nowrap", // Prevent text wrapping
            overflow: "hidden",
            textOverflow: "ellipsis", // Add ellipsis for overflow text
          },
        }}
      >
        <MuiTable>
          <VuiBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </VuiBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
      {pagination && renderPaginationControls()}
    </VuiBox>
  );
}

// Setting default values for the props of Table
Table.defaultProps = {
  columns: [],
  rows: [{}],
  pagination: false,
  rowsPerPageOptions: [5, 10, 25],
  initialRowsPerPage: 10
};

// Typechecking props for the Table
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.bool,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  initialRowsPerPage: PropTypes.number
};

export default Table;