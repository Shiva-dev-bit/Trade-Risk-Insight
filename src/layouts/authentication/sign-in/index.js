import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgSignIn from "assets/images/signInImage.png";
import { supabase } from "lib/supabase";
import { useHistory } from 'react-router-dom';
import { AuthContext } from "context/Authcontext";
import { Password } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [signIn, setSignIn] = useState({ email: '', Password: '' });
  const [err, setErr] = useState('');
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state


  const history = useHistory();

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
          history.push('/dashboard'); // Navigate to the dashboard
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
      title="Nice to see you!"
      color="white"
      description="Enter your email and password to sign in"
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE UI Risk LENS AI DASHBOARD"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form">
        {err && (
          <VuiTypography variant="body2" color="error" textAlign="center" mb={2} sx={{
            color: '#1ae9f0', fontWeight: 'bold'
          }}>
            {err}
          </VuiTypography>
        )}
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium" name="email">
              Email
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput type="email" placeholder="Your email..." fontWeight="500" name="email" onChange={handleSignIn} value={signIn.email} />
          </GradientBorder>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium" name="Password">
              Password
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput type="password" placeholder="Your password..." fontWeight="500" name="Password" onChange={handleSignIn} value={signIn.Password} />
          </GradientBorder>
        </VuiBox>
        <VuiBox display="flex" alignItems="center">
          <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
          <VuiTypography
            variant="caption"
            color="white"
            fontWeight="medium"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Remember me
          </VuiTypography>
        </VuiBox>
        <VuiTypography
          component={Link}
          to="/authentication/forget-password"
          variant="button"
          color="white"
          fontWeight="medium"
          sx={{ cursor: "pointer" }}
        >
          Forgot Password?
        </VuiTypography>
        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth onClick={signInWithEmail} disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'SIGN IN'}
          </VuiButton>
        </VuiBox>
        <VuiBox mt={3} textAlign="center">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <VuiTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="white"
              fontWeight="medium"
            >
              Sign up
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default SignIn;
