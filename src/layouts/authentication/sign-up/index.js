/**
=========================================================
* Soft UI Dashboard React - v4.0.1
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

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import curved6 from "assets/images/curved-images/curved14.jpg";
import { supabase } from "lib/supabase";

function SignUp() {
  const [signUp, setSignUp] = useState({
    email: '',
    full_name: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError('');
    setAlert('');
  };

  const signUpNewUser = async (e) => {
    e.preventDefault();
    setError('');
    setAlert('');
    setLoading(true);

    const { email, full_name, password } = signUp;

    console.log('email', email);

    // Check if user exists in `users` table
    const { data: existingUser, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)


    if (userFetchError && userFetchError.code !== 'PGRST116') {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      return;
    }

    console.log('existingUser', existingUser);

    if (existingUser.length > 0) {
    
      setError("User already exists with this email.");
      setLoading(false);
    } 


    if (existingUser.length <= 0 ) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://trade-risk-insight.vercel.app/dashboard',
          data: { display_name: full_name }, 
        },
      });
      

      if (signUpError) {
        setError("Error signing up. Please try again.");
      } else {
        setAlert('Please check Email to confirm account');
        const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email: email, username: full_name}]);

      if (insertError) {
        console.log("Error adding user to database. Please try again.");
      } else {
        console.log("New user added:");
      }
      setLoading(false);
      }
    }

    setSignUp({
      email: '',
      password: '',
      full_name: '',
    });

    setLoading(false);
  };
  
  return (
    <BasicLayout
      title="Welcome!"
      description="Fill in your details to create an account"
      image={curved6}
    >
      <Card style={{padding : '10px'}}>
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
  
            {/* Agreement Checkbox */}
            <SoftBox display="flex" alignItems="center" mb={2}>
              <Checkbox  />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                I agree to the
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                Terms and Conditions
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
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
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
