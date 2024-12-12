import { Card, Icon, Typography } from "@mui/material";
import welcome from "assets/images/welcome-profile.png";
import VuiTypography from "components/VuiTypography/index";
import VuiBox from "components/VuiBox/index";

const Welcome = ({ username, email }) => {
  return (
    <Card
      sx={({ breakpoints }) => ({
        background: `url(${welcome})`,
        backgroundSize: "cover",
        borderRadius: "20px",
        height: "100%",
        [breakpoints.only("xl")]: {
          gridArea: "1 / 1 / 2 / 2",
        },
      })}
    >
      <VuiBox display="flex" flexDirection="column" sx={{ height: "100%" }}>
        <VuiBox display="flex" flexDirection="column" mb="auto">
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="3px">
            Welcome back!
          </VuiTypography>
          <Typography
            color="#fff"
            textTransform={"capitalize"}
            variant="button"
            fontWeight="regular"
          >
            Nice to see you, {username}
          </Typography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default Welcome;
