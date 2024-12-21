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

import { useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// RiskCompass AI React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "lib/supabase";


function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [signIn, setSignIn] = useState({ email: '', Password: '' });
  const [err, setErr] = useState('');
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state


  const history = useNavigate();

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*').ilike('email', signIn?.email)

      if (data) {
        setUser(data)
      }
      else {
        console.log('error', error.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [signIn?.email])

  console.log('user', user);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = (e) => {
    const { name, value } = e.target;
    setSignIn(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErr('');
  };

  const signInWithEmail = async (e) => {
    setErr('');
    e.preventDefault();

    const { email, Password } = signIn;

    if (!email) {
      setErr('Please provide your email address');
      return;
    }

    console.log('sign in');
    try {
      setLoading(true); // Start loading
      if (user.length <= 0) {
        setErr('User not exist. Please SignUp.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: Password,
        });

        if (error) {
          setErr(error.message);
        } else {
          console.log('Signed in successfully!');
          history('/dashboard'); // Navigate to the dashboard
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErr('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <CoverLayout
      title="Welcome Back"
      description="Enter the required fields to sign in"
      image={curved9} // Change to your desired background
    >
      <SoftBox component="form" role="form" onSubmit={signInWithEmail} >
        {/* Error Message */}
        {err && (
          <SoftTypography
            variant="body2"
            color="error"
            textAlign="center"
            mb={2}
            sx={{ color: "#1ae9f0", fontWeight: "bold" }}
          >
            {err}
          </SoftTypography>
        )}
  
        {/* Email Input */}
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder="Your email..."
            name="email"
            value={signIn.email}
            onChange={handleSignIn}
            required
          />
        </SoftBox>
  
        {/* Password Input */}
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            placeholder="Your password..."
            name="Password"
            value={signIn.Password}
            onChange={handleSignIn}
            required
          />
        </SoftBox>
  
        {/* Remember Me & Forgot Password */}
        <SoftBox display="flex" alignItems="center" mb={2}>
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </SoftTypography>
        </SoftBox>
        <SoftTypography
          component={Link}
          to="/authentication/forget-password"
          variant="button"
          color="info"
          fontWeight="medium"
          sx={{ cursor: "pointer", display: "block", marginBottom: "10px" }}
        >
          Forgot Password?
        </SoftTypography>
  
        {/* Sign-In Button */}
        <SoftBox mt={4} mb={1}>
          <SoftButton
            variant="gradient"
            color="info"
            fullWidth
            disabled={loading}
            type="submit"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "SIGN IN"}
          </SoftButton>
        </SoftBox>
  
        {/* Sign-Up Redirect */}
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
  
}

export default SignIn;
