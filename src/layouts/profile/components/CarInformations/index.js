import { Card, Stack, Grid } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import GreenLightning from "assets/images/shapes/green-lightning.svg";
import WhiteLightning from "assets/images/shapes/white-lightning.svg";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import carProfile from "assets/images/shapes/car-profile.svg";
import LineChart from "examples/Charts/LineCharts/LineChart";
import { lineChartDataProfile1, lineChartDataProfile2 } from "variables/charts";
import { lineChartOptionsProfile2, lineChartOptionsProfile1 } from "variables/charts";
import CircularProgress from "@mui/material/CircularProgress";
const CarInformations = ({ userdata }) => {
  // console.log(userdata);
  const { gradients, info } = colors;
  const { cardContent } = gradients;
  return (
    <Card
      sx={{ height : '100%'}}
    >
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="lg" color="white" fontWeight="bold" mb="6px">
          Stock Informations
        </VuiTypography>
        <VuiTypography variant="button" color="text" fontWeight="regular" mb="30px">
          Hello, <span style={{ textTransform: "capitalize" }}>{userdata}</span>!
        </VuiTypography>
      </VuiBox>
    </Card>
  );
};

export default CarInformations;
