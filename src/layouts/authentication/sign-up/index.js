/**
=========================================================
* RiskCompass AI React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// RiskCompass AI React components
import SoftBox from "/src/components/SoftBox";
import SoftTypography from "/src/components/SoftTypography";
import SoftInput from "/src/components/SoftInput";
import SoftButton from "/src/components/SoftButton";

// Authentication layout components
import BasicLayout from "/src/layouts/authentication/components/BasicLayout";
import Socials from "/src/layouts/authentication/components/Socials";
import Separator from "/src/layouts/authentication/components/Separator";

// Images
import curved6 from "/src/assets/images/curved-images/curved14.jpg";
import { supabase } from "/src/lib/supabase";
import TermsAndConditions from "/src/layouts/authentication/terms-and-conditions";

function SignUp() {
  const [signUp, setSignUp] = useState({
    email: "",
    full_name: "",
    password: "",
    mobile_number: "",
    country: "",
    country_code: "",
  });

  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const countriesList = [
    { name: "United States", dial_code: "+1" },
    { name: "India", dial_code: "+91" },
    { name: "United Kingdom", dial_code: "+44" },
    // Add more countries as needed
  ];

  const validatePhoneNumber = (number, countryCode) => {
    // Remove any non-numeric characters except +
    const cleanNumber = number.replace(/[^\d+]/g, "");

    // Basic country-specific validation
    const phonePatterns = {
      "+1": /^\+1\d{10}$/, // USA/Canada
      "+91": /^\+91\d{10}$/, // India
      "+44": /^\+44\d{10}$/, // UK
      // Add more country patterns as needed
    };

    return phonePatterns[countryCode]?.test(cleanNumber) || false;
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "mobile_number") {
      // Ensure number starts with country code
      const formattedNumber = value.startsWith("+") ? value : `${signUp.country_code}${value}`;
      setSignUp((prev) => ({ ...prev, mobile_number: formattedNumber }));
    } else if (name === "country") {
      // Update country code when country changes
      const countryDetails = countriesList.find((c) => c.name === value);
      setSignUp((prev) => ({
        ...prev,
        country: value,
        country_code: countryDetails?.dial_code || "",
        mobile_number: "", // Reset phone number when country changes
      }));
    } else {
      setSignUp((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
    setAlert("");
  };

  const validateForm = async () => {
    if (!validatePhoneNumber(signUp.mobile_number, signUp.country_code)) {
      setError('Please enter a valid phone number for the selected country');
      return false;
    }
  
    // Check if phone number already exists
    const { data: existingPhone } = await supabase
      .from('users')
      .select('mobile_number')
      .eq('mobile_number', signUp.mobile_number);
  
    if (existingPhone?.length > 0) {
      setError('This phone number is already registered');
      return false;
    }
  
    return true;
  };

  const signUpNewUser = async (e) => {
    e.preventDefault();
    setError("");
    setAlert("");
    setLoading(true);

    if (!(await validateForm())) {
      setLoading(false);
      return;
    }

    const { email, full_name, password } = signUp;

    console.log("email", email);

    // Check if user exists in `users` table
    const { data: existingUser, error: userFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (userFetchError && userFetchError.code !== "PGRST116") {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      return;
    }

    console.log("existingUser", existingUser);

    if (existingUser.length > 0) {
      setError("User already exists with this email.");
      setLoading(false);
    }

    if (existingUser.length <= 0) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://trade-risk-insight.vercel.app/dashboard",
          data: { display_name: full_name },
        },
      });

      if (signUpError) {
        setError("Error signing up. Please try again.");
      } else {
        setAlert("Please check Email to confirm account");
        const { data: newUser, error: insertError } = await supabase.from("users").insert([
          {
            email: email,
            username: full_name,
            mobile_number: signUp.mobile_number,
            country: signUp.country,
          },
        ]);

        if (insertError) {
          console.log("Error adding user to database. Please try again.");
        } else {
          console.log("New user added:");
        }
        setLoading(false);
      }
    }

    setSignUp({
      email: "",
      password: "",
      full_name: "",
    });

    setLoading(false);
  };

  return (
    <BasicLayout
      title="Welcome!"
      description="Fill in your details to create an account"
      image={curved6}
    >
      <Card style={{ padding: "10px" }}>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" onSubmit={signUpNewUser}>
            {/* Display Error Messages */}
            {error && (
              <SoftTypography
                variant="body2"
                color="error"
                textAlign="center"
                mb={2}
                sx={{ fontWeight: "bold" }}
              >
                {error}
              </SoftTypography>
            )}
            {alert && (
              <SoftTypography
                variant="body2"
                textAlign="center"
                mb={2}
                sx={{ color: "#1ae9f0", fontWeight: "bold" }}
              >
                {alert}
              </SoftTypography>
            )}

            {/* Name Input */}
            <SoftBox mb={2}>
              <SoftInput
                type="text"
                placeholder="Your full name..."
                name="full_name"
                value={signUp.full_name}
                onChange={handleSignUpChange}
                required
              />
            </SoftBox>

            {/* Email Input */}
            <SoftBox mb={2}>
              <SoftInput
                type="email"
                placeholder="Your email..."
                name="email"
                value={signUp.email}
                onChange={handleSignUpChange}
                required
              />
            </SoftBox>

            {/* Password Input */}
            <SoftBox mb={2}>
              <SoftInput
                type="password"
                placeholder="Your password..."
                name="password"
                value={signUp.password}
                onChange={handleSignUpChange}
                required
              />
            </SoftBox>

            {/* Country Selection dropdown*/}
            <SoftBox mb={2}>
              <select
                name="country"
                value={signUp.country}
                onChange={handleSignUpChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d2d6da",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  color:"#344767"
                }}
              >
                <option value="">Select your country</option>
                {countriesList.map((country) => (
                  <option key={country.dial_code} value={country.name}>
                    {country.name} ({country.dial_code})
                  </option>
                ))}
              </select>
            </SoftBox>

            {/* Mobile number input with country code */}
            <SoftBox mb={2}>
              <SoftInput
                type="tel"
                placeholder={`${signUp.country_code || "+1"} Enter mobile number`}
                name="mobile_number"
                value={signUp.mobile_number}
                onChange={handleSignUpChange}
                required
              />
            </SoftBox>

            {/* Agreement Checkbox */}
            <SoftBox display="flex" alignItems="center">
              <Checkbox />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                color="dark"
                sx={{ cursor: "pointer", userSelect: "none", textTransform: "none" }}
              >
               &nbsp;&nbsp;I agree to the&nbsp;
              </SoftTypography>
              <SoftTypography
                component={Link}
                to="/terms-and-conditions" // route for Terms And Conditions
                variant="button"
                fontWeight="bold"
                textGradient
          
                sx={{ ml: 1,textTransform: "none",marginLeft:"0px" }}
              >
                Terms & Conditions
              </SoftTypography>
              <SoftTypography
                variant="button"
                fontWeight="regular"
                color="dark"
                sx={{ ml: 1, textTransform: "none", marginLeft:"5px" }}
              >
                and
              </SoftTypography>
              
            </SoftBox>
            <SoftBox display="flex" alignItems="center" mb={2} justifyContent="center">
            <SoftTypography
                component={Link}
                to="/privacy-policy" // route for Privacy policy
                variant="button"
                fontWeight="bold"
                textGradient
                sx={{ ml: 1,textTransform: "none" }}
              >
                Privacy Policy
              </SoftTypography>
            </SoftBox>

            {/* Submit Button */}
            <SoftBox mt={4} mb={1}>
              <SoftButton
                variant="gradient"
                color="dark"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "SIGN UP"}
              </SoftButton>
            </SoftBox>

            {/* Redirect to Sign In */}
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular" sx={{ textTransform: "none" }}>
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                  sx={{ textTransform: "none" }}
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;