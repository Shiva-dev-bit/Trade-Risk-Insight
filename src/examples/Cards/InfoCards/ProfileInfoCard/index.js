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

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// RiskCompass AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// RiskCompass AI React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({ title, info, action, isEditing, onChange, onCancel }) {
  // Updated fields mapping to match database fields
  const fields = {
    fullName: { label: "Username", key: "username" },        // Changed key to match database
    mobile: { label: "Mobile Number", key: "mobile_number" }, // Changed key to match database
    email: { label: "Email", key: "email" },
    location: { label: "Location", key: "country" }          // Changed key to match database
  };

  const renderItems = Object.entries(fields).map(([fieldName, { label, key }]) => (
    <SoftBox key={fieldName} display="flex" flexDirection="column" py={1} pr={2}>
      <SoftTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}
      </SoftTypography>
      {isEditing ? (
        <TextField
          fullWidth
          value={info[fieldName] || ""}
          onChange={onChange(key)}  // Use the database field key here
          disabled={fieldName === "email"}
          size="small"
          sx={{ 
            mt: 1,
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
            }
          }}
        />
      ) : (
        <SoftTypography variant="button" fontWeight="regular" color="text">
          {info[fieldName]}
        </SoftTypography>
      )}
    </SoftBox>
  ));

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
        {!isEditing && (
          <SoftTypography 
            component="button" 
            onClick={action.onClick} 
            variant="body2" 
            color="secondary"
            sx={{ 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
          >
            <Tooltip title={action.tooltip} placement="top">
              <Icon>edit</Icon>
            </Tooltip>
          </SoftTypography>
        )}
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox>{renderItems}</SoftBox>
        {isEditing && (
          <SoftBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button 
              variant="contained" 
              color="dark" 
              onClick={onCancel}
              sx={{ textTransform: 'capitalize' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="dark" 
              onClick={action.onClick}
              sx={{ textTransform: 'capitalize' }}
            >
              Save Changes
            </Button>
          </SoftBox>
        )}
      </SoftBox>
    </Card>
  );
}

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  action: PropTypes.shape({
    tooltip: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
};

ProfileInfoCard.defaultProps = {
  isEditing: false,
};

export default ProfileInfoCard;