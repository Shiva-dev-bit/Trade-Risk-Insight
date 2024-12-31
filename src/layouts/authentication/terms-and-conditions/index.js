// terms and conditions component

// @mui material components
import Card from "@mui/material/Card";

// RiskCompass AI React components
import SoftBox from "/src/components/SoftBox";
import SoftButton from "/src/components/SoftButton";
import SoftTypography from "/src/components/SoftTypography";
import { Link } from "react-router-dom";


function TermsAndConditions() {
  return (
    <Card sx={{ width: "60%", marginLeft: "auto", marginRight: "auto", marginTop: "100px" }}>
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={2}>
          Terms and Conditions
        </SoftTypography>
        <SoftTypography variant="body2" fontWeight="regular" >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus a dolor sit
          amet varius. Praesent lacinia ullamcorper magna, id sagittis urna ornare vel. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Aliquam scelerisque, sem sit amet scelerisque
          aliquet, dui mauris tempus massa, eu maximus diam diam quis tortor. Proin et pretium ex.
          Curabitur porttitor, neque et vehicula feugiat, ante erat molestie metus, non congue mi mi
          eu ex. Morbi nec sollicitudin neque. Maecenas ultrices urna id laoreet lobortis. Aliquam a
          augue dui. Integer tincidunt dictum eros quis molestie. Suspendisse ipsum tortor,
          pellentesque sed convallis et, sodales sed massa. Vestibulum quis dolor vel nulla
          consequat molestie. Proin dolor metus, malesuada in metus id, ultricies porta sem.
          Suspendisse potenti. Fusce ornare a augue non dignissim. Praesent tincidunt eros eget
          felis venenatis scelerisque. Pellentesque congue, orci id efficitur eleifend, eros orci
          molestie nisl, in cursus dolor mauris a tortor. Cras ac odio mi. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Nullam feugiat lobortis felis, id sodales mi ultrices
          vitae. Donec luctus mauris ligula, sit amet malesuada orci tincidunt et. Ut fringilla
          pretium eros condimentum finibus. Nullam venenatis dolor quis mauris mollis, et faucibus
          velit semper. Phasellus sollicitudin a leo at fermentum. Quisque imperdiet nisl risus, ut
          hendrerit erat commodo vitae. Sed nec facilisis tellus, non ullamcorper massa. Morbi
          dapibus, lorem nec luctus malesuada, est ligula ultrices elit, lacinia molestie libero
          risus ac massa. Nullam et tristique orci. Suspendisse potenti. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas. Praesent sodales, dui
          vel sollicitudin laoreet, sem sem blandit quam, eget malesuada lectus orci eu augue. Fusce
          sapien turpis, egestas a massa eu, tempus tristique sem. Nullam id ipsum a est vehicula
          vulputate id ut tortor. Donec ut efficitur risus, in bibendum erat. Aliquam quis lorem
          diam. Phasellus et metus id quam blandit lacinia. Vestibulum commodo metus mauris, sed
          interdum nibh posuere nec. Cras lacinia leo vitae nisi varius sollicitudin. Mauris
          porttitor urna libero, ac pharetra enim egestas accumsan. Vestibulum ut purus fermentum,
          finibus elit sit amet, convallis elit. Quisque dui nibh, scelerisque finibus laoreet at,
          sollicitudin lobortis quam. Nam blandit at felis vestibulum sagittis. Pellentesque congue
          enim sit amet felis sollicitudin, nec tincidunt metus posuere. Aliquam erat nunc, aliquam
          non fermentum vitae, mollis sit amet metus. Sed fermentum ante quis dui fringilla rhoncus.
          Aliquam erat volutpat. Phasellus metus elit, eleifend sed enim non, imperdiet facilisis
          nisl. Duis eu eros quis massa ornare elementum. Aenean metus urna, posuere quis ligula id,
          dapibus molestie nisi. Donec bibendum, elit varius gravida pharetra, dui elit suscipit
          urna, ornare condimentum eros felis ut neque. Pellentesque fringilla sagittis tempus.
          Suspendisse ultrices lobortis odio sed consectetur. Pellentesque eleifend hendrerit magna,
          vitae scelerisque neque bibendum in.
        </SoftTypography>
      </SoftBox>
      {/* back button */}
      <SoftBox display="flex" justifyContent="center" mt={3} mb={2}>
        <SoftButton
          component={Link}
          to="/authentication/sign-up"
          variant="gradient"
          color="dark"
        >
          Back
        </SoftButton>
      </SoftBox>

    </Card>
  );
}

export default TermsAndConditions;
