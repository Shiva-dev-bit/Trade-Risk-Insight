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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// UI Risk LENS AI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// UI Risk LENS AI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({ title, description, info, social }) {
  const labels = [];
  const values = [];
  const { size } = typography;

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <SoftBox key={label} display="flex" py={1} pr={2}>
      <SoftTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
        {label}: &nbsp;
      </SoftTypography>
      <SoftTypography variant="button" fontWeight="regular" color="black">
        &nbsp;{values[key]}
      </SoftTypography>
    </SoftBox>
  ));

  // Render the card social media icons
  // const renderSocial = social.map(({ link, icon, color }) => (
  //   <SoftBox
  //     key={color}
  //     component="a"
  //     href={link}
  //     target="_blank"
  //     rel="noreferrer"
  //     fontSize={size.lg}
  //     color="black"
  //     pr={1}
  //     pl={0.5}
  //     lineHeight={1}
  //   >
  //     {icon}
  //   </SoftBox>
  // ));

  return (
    <Card
      sx={{
        height: "100%",
        padding : '10px'
      }}
    >
      <SoftBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="lg" fontWeight="bold" color="black" textTransform="capitalize">
          {title}
        </SoftTypography>
      </SoftBox>
      <SoftBox>
        <SoftBox mb={2} lineHeight={1}>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            {description}
          </SoftTypography>
        </SoftBox>
        <SoftBox opacity={0.3}>
          <Divider />
        </SoftBox>
        <SoftBox>
          {renderItems}
          {/* <SoftBox display="flex" py={1} pr={2} color="black">
            <SoftTypography
              variant="button"
              fontWeight="regular"
              color="text"
              textTransform="capitalize"
            >
              social: &nbsp;
            </SoftTypography>
            {renderSocial}
          </SoftBox> */}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProfileInfoCard;
