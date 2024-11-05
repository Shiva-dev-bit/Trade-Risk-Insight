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

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [signIn, setSignIn] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [user,setUser] = useState([]);

  console.log('signIn',signIn.email)
  const history = useHistory();

   const fetchUser = async () => {
    try {
      const { data,error } = await supabase.from('users').select('*').ilike('email',signIn?.email)

      if(data){
         setUser(data)
      }
      else{
        console.log('error',error.message);
      }
    }catch(error){
      console.log(error);
    }
   }

  useEffect(() => {
     fetchUser()
  },[signIn?.email])

  console.log('user',user);

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
    e.preventDefault();
    setErr(''); 
 
    setLoading(true); 

    const { email, password } = signIn;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false); 

    if(user.length <= 0){
      setErr('User not exist Please SignUp');
    }
    else if (error) {
      console.error('Error signing in:', error.message);
      setErr(error.message); 
    } else {
      console.log('Sign in successful! User data:', data);
      history.push('/dashboard');
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
          <VuiTypography variant="body2" color="error" textAlign="center" mb={2}>
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
            <VuiInput type="email" placeholder="Your email..." fontWeight="500" name="email" onChange={handleSignIn} value={signIn.email}/>
          </GradientBorder>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium" name="password">
              Password
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            borderRadius={borders.borderRadius.lg}
            padding="1px"
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
              onChange={handleSignIn}
              value={signIn.password}
            />
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
            {loading ? 'Signing in...' : 'SIGN IN'}
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
