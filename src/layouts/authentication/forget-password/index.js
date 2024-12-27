import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { supabase } from 'lib/supabase';
import { useHistory } from 'react-router-dom';
import curved9 from "assets/images/curved-images/curved-6.jpg";


const ForgotPassword = () => {
    const [email, setEmail] = useState(''); 
    const [resetMessage, setResetMessage] = useState(''); // State for success or error message

    useEffect(() => {
        setTimeout(() => {
            setResetMessage('');
        }, 5000);
    },[resetMessage])
    // const history = useHistory();

    const handleResetPassword = async (e) => {
        e.preventDefault(); 

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            emailRedirectTo: 'http://localhost:3000/authentication/reset-password' 
          });
          
    
        if (error) {
            console.error("Error sending reset link:", error); 
            setResetMessage("Failed to send reset link. Please try again."); 
        } else {
            setResetMessage("Password reset link has been sent to your email. Please check"); // Success message
            console.log("Reset link sent:", data);
        }

        setEmail('')
    };

    return (
        <CoverLayout
            title="Forgot Your Password"
            color="black" // Change the layout color if necessary
            description="Enter your email to receive a password reset link."
            image={curved9}
        >
            <SoftBox component="form" role="form" onSubmit={handleResetPassword}>
                <SoftBox mb={2}>
                    <SoftBox mb={1} ml={0.5}>
                        <SoftTypography component="label" variant="button" color="black" fontWeight="medium">
                            Email
                        </SoftTypography>
                    </SoftBox>
                    <SoftInput 
                        type="email" 
                        placeholder="Your email..." 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </SoftBox>
                <SoftBox mt={4} mb={1}>
                    <SoftButton color="black" fullWidth type="submit">
                        Send Reset Link
                    </SoftButton>
                </SoftBox>
                {resetMessage && ( // Conditionally render the message
                    <SoftBox mt={2}>
                        <SoftTypography color="black" fontWeight="small" >
                            {resetMessage}
                        </SoftTypography>
                    </SoftBox>
                )}
            </SoftBox>
        </CoverLayout>
    );
    
};

export default ForgotPassword;
