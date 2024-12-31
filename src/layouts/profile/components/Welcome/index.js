import { Card, Icon, Typography } from "@mui/material";
import welcome from "/src/assets/images/curved-images/white-curved.jpeg";
import SoftTypography from "/src/components/SoftTypography/index";
import SoftBox from "/src/components/SoftBox/index";
import PropTypes from "prop-types";

const Welcome = ({ username, email }) => {
  return (
    <Card
      sx={({ breakpoints }) => ({
        background: `url(${welcome})`,
        backgroundSize: "cover",
        borderRadius: "20px",
        height: "100%",
        padding : '10px',
        [breakpoints.only("xl")]: {
          gridArea: "1 / 1 / 2 / 2",
        },
      })}
    >
      <SoftBox display="flex" flexDirection="column" sx={{ height: "100%" }}>
        <SoftBox display="flex" flexDirection="column" mb="auto">
          <SoftTypography color="black" variant="h3" fontWeight="bold" mb="3px">
            Welcome back!
          </SoftTypography>
          <Typography
            color="#000"
            textTransform={"capitalize"}
            variant="button"
            fontWeight="regular"
          >
            Nice to see you, {username}
          </Typography>
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

Welcome.propTypes = {
    username: PropTypes.string,
    email: PropTypes.string,
};

export default Welcome;
