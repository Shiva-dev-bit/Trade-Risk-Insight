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

/* eslint-disable react/prop-types */
/**
  This file is used for controlling the dark and light state of the TimelineList and TimelineItem.
*/

import { createContext, useContext } from "react";

// The Timeline main context
const Timeline = createContext();

// Timeline context provider
function TimelineProvider({ children, value }) {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using context
function useTimeline() {
  return useContext(Timeline);
}

export { TimelineProvider, useTimeline };
/* eslint-enable react/prop-types */
