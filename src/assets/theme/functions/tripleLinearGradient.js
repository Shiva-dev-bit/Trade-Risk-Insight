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
  The linearGradient() function helps you to create a linear gradient color background
 */

function tripleLinearGradient(color, colorState, colorStateSecondary, angle) {
  if (angle === undefined) {
    angle = 310;
  }
  return `linear-gradient(${angle}deg, ${color}, ${colorState}, ${colorStateSecondary})`;
}

export default tripleLinearGradient;
