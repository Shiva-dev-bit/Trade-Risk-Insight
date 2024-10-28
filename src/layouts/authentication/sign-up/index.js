import { useState } from 'react';
import { Link } from 'react-router-dom';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiInput from 'components/VuiInput';
import VuiButton from 'components/VuiButton';
import GradientBorder from 'examples/GradientBorder';
import radialGradient from 'assets/theme/functions/radialGradient';
import palette from 'assets/theme/base/colors';
import borders from 'assets/theme/base/borders';
import CoverLayout from 'layouts/authentication/components/CoverLayout';
import bgSignIn from 'assets/images/signInImage.png';
import { supabase } from 'lib/supabase';
import { useHistory } from 'react-router-dom';

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
  };

  const signUpNewUser = async (e) => {
    e.preventDefault();
    setError('');
    setAlert('');
    setLoading(true);
  
    const { email, full_name, password } = signUp;
  
    // Check if user exists in `users` table
    const { data: existingUser, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
  
    if (userFetchError && userFetchError.code !== 'PGRST116') {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      return;
    }
  
    if (existingUser) {
      // User already exists
      setError("User already exists with this email.");
      setLoading(false);
    } else {
      // If user does not exist, insert the new user into `users` table
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email: email, username: full_name, hashed_password: password }]);
  
      if (insertError) {
        setError("Error adding user to database. Please try again.");
      } else {
        console.log("New user added:");
        setAlert('Please check inbox to confirm account');
      }
      setLoading(false);
    }
  
    // Proceed with signup if user doesn't exist
    const { data, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/authentication/sign-in',
        },
      },
      {
        data: { display_name: full_name },
      }
    );
  
    if (signUpError) {
      setError("Error signing up. Please try again.");
    } else {
      setAlert('Please check inbox to confirm account');
    }
  
    setSignUp({
      email: '',
      password: '',
      full_name: '',
    });
  
    setLoading(false);
  };
  return (
    <CoverLayout
      title="Join Us"
      color="white"
      description="Fill in your details to create an account"
      premotto="WELCOME TO"
      motto="RISK LENS AI DASHBOARD"
      image={bgSignIn}
    >
      <VuiBox component="form" onSubmit={signUpNewUser}>
        {error && (
          <VuiTypography variant="body2" color="error" textAlign="center" mb={2}>
            {error}
          </VuiTypography>
        )}
        {alert && (
          <VuiTypography variant="body2" color="white" textAlign="center" mb={2}>
            {alert}
          </VuiTypography>
        )}
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Full Name
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
            <VuiInput
              type="text"
              placeholder="Your full name..."
              fontWeight="500"
              name="full_name"
              onChange={handleSignUpChange}
              required
            />
          </GradientBorder>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
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
            <VuiInput
              type="email"
              placeholder="Your email..."
              fontWeight="500"
              name="email"
              onChange={handleSignUpChange}
              required
            />
          </GradientBorder>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
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
            <VuiInput
              type="password"
              placeholder="Your password..."
              sx={({ typography: { size } }) => ({
                fontSize: size.sm,
              })}
              name="password"
              onChange={handleSignUpChange}
              required
            />
          </GradientBorder>
        </VuiBox>
        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'SIGN UP'}
          </VuiButton>
        </VuiBox>
        <VuiBox mt={3} textAlign="center">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Already have an account?{" "}
            <VuiTypography
              component={Link}
              to="/authentication/sign-in"
              variant="button"
              color="white"
              fontWeight="medium"
            >
              Sign in
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default SignUp;
