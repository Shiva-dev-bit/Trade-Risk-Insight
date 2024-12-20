import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftAvatar from "components/SoftAvatar";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

function Table({ columns, rows, pagination = false, rowsPerPageOptions = [5, 10, 25], initialRowsPerPage = 10 }) {
  const { light, dark } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

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
      <SoftBox
        key={name}
        component="th"
        width={width || "auto"}
        pt={1.5}
        pb={1.25}
        pl={align === "left" ? pl : 3}
        pr={align === "right" ? pr : 3}
        textAlign={align}
        fontSize={size.xxs}
        fontWeight={fontWeightBold}
        color="secondary"
        opacity={0.7}
        borderBottom={`${borderWidth[1]} solid ${light.main}`}
      >
        {name.toUpperCase()}
      </SoftBox>
    );
  });

  const renderRows = pagination
    ? useMemo(() =>
        rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
          const rowKey = `row-${key}`;

          const tableRow = columns.map(({ name, align }) => {
            let template;

            if (Array.isArray(row[name])) {
              template = (
                <SoftBox
                  key={uuidv4()}
                  component="td"
                  p={1}
                  borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
                >
                  <SoftBox display="flex" alignItems="center" py={0.5} px={1}>
                    <SoftBox mr={2}>
                      <SoftAvatar src={row[name][0]} name={row[name][1]} variant="rounded" size="sm" />
                    </SoftBox>
                    <SoftTypography variant="button" fontWeight="medium" sx={{ width: "max-content" }}>
                      {row[name][1]}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              );
            } else {
              template = (
                <SoftBox
                  key={uuidv4()}
                  component="td"
                  p={1}
                  textAlign={align}
                  borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
                >
                  <SoftTypography
                    variant="button"
                    fontWeight="regular"
                    color="secondary"
                    sx={{ display: "inline-block", width: "max-content", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {row[name]}
                  </SoftTypography>
                </SoftBox>
              );
            }

            return template;
          });

          return <TableRow key={rowKey}>{tableRow}</TableRow>;
        }),
      [page, rowsPerPage, rows, columns])
    : rows.map((row, key) => {
        const rowKey = `row-${key}`;

        const tableRow = columns.map(({ name, align }) => {
          let template;

          if (Array.isArray(row[name])) {
            template = (
              <SoftBox
                key={uuidv4()}
                component="td"
                p={1}
                borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
              >
                <SoftBox display="flex" alignItems="center" py={0.5} px={1}>
                  <SoftBox mr={2}>
                    <SoftAvatar src={row[name][0]} name={row[name][1]} variant="rounded" size="sm" />
                  </SoftBox>
                  <SoftTypography variant="button" fontWeight="medium" sx={{ width: "max-content" }}>
                    {row[name][1]}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            );
          } else {
            template = (
              <SoftBox
                key={uuidv4()}
                component="td"
                p={1}
                textAlign={align}
                borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
              >
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  color="secondary"
                  sx={{ display: "inline-block", width: "max-content", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {row[name]}
                </SoftTypography>
              </SoftBox>
            );
          }

          return template;
        });

        return <TableRow key={rowKey}>{tableRow}</TableRow>;
      });

  const renderPaginationControls = () => (
    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2}>
      <SoftBox display="flex" alignItems="center">
        <SoftTypography variant="caption" color="dark" mr={1}>
          Rows per page:
        </SoftTypography>
        <select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          style={{
            backgroundColor: dark.main,
            color: "white",
            border: `1px solid ${dark.main}`,
            borderRadius: "4px",
            padding: "4px",
          }}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </SoftBox>

      <SoftBox display="flex" alignItems="center">
        <SoftTypography variant="caption" color="dark" mr={2}>
          {`Page ${page + 1} of ${totalPages}`}
        </SoftTypography>

        <button
          disabled={page === 0}
          onClick={() => handleChangePage(page - 1)}
          style={{
            minWidth: "40px",
            height: "40px",
            backgroundColor: page === 0 ? dark.main : "dark",
            color: page === 0 ? dark.main : "white",
            border: `1px solid ${dark.main}`,
            borderRadius: "4px",
            marginRight: "8px",
          }}
        >
          Prev
        </button>

        <button
          disabled={page === totalPages - 1}
          onClick={() => handleChangePage(page + 1)}
          style={{
            minWidth: "40px",
            height: "40px",
            backgroundColor: page === totalPages - 1 ? dark.main : "dark",
            color: page === totalPages - 1 ? dark.main : "white",
            border: `1px solid ${dark.main}`,
            borderRadius: "4px",
          }}
        >
          Next
        </button>
      </SoftBox>
    </SoftBox>
  );

 // Update the TableContainer styling in the Table component
return (
  <SoftBox>
    <TableContainer
      sx={{
        width: "100%",
        overflowX: "auto", // Enable horizontal scroll only when needed
        "&::-webkit-scrollbar": {
          height: "8px"
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px"
        },
        "& table": {
          minWidth: "100%", // Ensure table takes full width
          tableLayout: "auto", // Allow table to adjust column widths
        },
        "& thead th": {
          padding: {
            xs: "8px 4px", // Smaller padding on mobile
            sm: "8px 8px", // Regular padding on larger screens
          },
          fontSize: {
            xs: "0.65rem",
            sm: "0.75rem"
          },
          color: "#000", // Pure black text
          whiteSpace: "nowrap",
        },
        "& tbody td": {
          padding: {
            xs: "6px 4px", // Smaller padding on mobile
            sm: "6px 8px", // Regular padding on larger screens
          },
          fontSize: {
            xs: "0.75rem",
            sm: "0.875rem"
          },
          color: "#000", // Pure black text
          whiteSpace: "nowrap",
          maxWidth: {
            xs: "120px", // Limit cell width on mobile
            sm: "200px", // More space on larger screens
          },
          overflow: "hidden",
          textOverflow: "ellipsis",
        }
      }}
    >
      <MuiTable>
        <SoftBox component="thead">
          <TableRow>{renderColumns}</TableRow>
        </SoftBox>
        <TableBody>{renderRows}</TableBody>
      </MuiTable>
    </TableContainer>
    {pagination && renderPaginationControls()}
  </SoftBox>
);
}

// Setting default values for the props of Table
Table.defaultProps = {
  columns: [],
  rows: [{}],
  pagination: false,
  rowsPerPageOptions: [5, 10, 25],
  initialRowsPerPage: 10,
};

// Typechecking props for the Table
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.bool,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  initialRowsPerPage: PropTypes.number,
};

export default Table;
