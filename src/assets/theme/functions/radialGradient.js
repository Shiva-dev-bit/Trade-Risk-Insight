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

/**
  The radialGradient() function helps you to create a radial gradient color background
 */

function radialGradient(color, colorState, angle) {
  if (angle === undefined) {
    angle = "69.43% 69.43% at 50% 50%";
  }
  return `radial-gradient(${angle}, ${color}, ${colorState})`;
}

export default radialGradient;
