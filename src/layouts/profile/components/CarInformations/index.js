import { Card, Stack, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import colors from "assets/theme/base/colors";
import PropTypes from "prop-types";

const CarInformations = ({ userdata }) => {
  // console.log(userdata);
  const { gradients, info } = colors;
  const { cardContent } = gradients;
  return (
    <Card
      sx={{ height : '100%' , padding : '10px'}}
    >
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="lg" color="black" fontWeight="bold" mb="6px">
          Stock Informations
        </SoftTypography>
        <SoftTypography variant="button" color="black" fontWeight="regular" mb="30px">
          Hello, <span style={{ textTransform: "capitalize" }}>{userdata}</span>!
        </SoftTypography>
      </SoftBox>
    </Card>
  );
};

CarInformations.propTypes = {
  userdata: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};


export default CarInformations;
