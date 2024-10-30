/*!

=========================================================
* Risk Protect AI React - v1.0.0
=========================================================

* Product Page: https://www.riskprotec.ai/product/riskprotect-ai
* Copyright 2021 RiskProtec AI (https://www.riskprotec.ai/)
* Licensed under MIT (https://github.com/riskprotectai/riskprotect-ai/blob/master LICENSE.md)

* Design and Coded by Simmmple & RiskProtec AI

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// UI Risk LENS AI Dashboard React Context Provider
import { VisionUIControllerProvider } from "context";
import { AuthProvider } from "context/Authcontext";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


root.render(<BrowserRouter>
  <VisionUIControllerProvider>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </VisionUIControllerProvider>
</BrowserRouter>)

