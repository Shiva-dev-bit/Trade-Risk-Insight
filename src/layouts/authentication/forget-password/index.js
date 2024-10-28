import React, { useState } from 'react';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiInput from 'components/VuiInput';
import VuiButton from 'components/VuiButton';
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { supabase } from 'lib/supabase';
import { useHistory } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState(''); 
    const [resetMessage, setResetMessage] = useState(''); // State for success or error message
    // const history = useHistory();

    const handleResetPassword = async (e) => {
        e.preventDefault(); 

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `http://localhost:3000/authentication/reset-password`, 
        });
    
        if (error) {
            console.error("Error sending reset link:", error); 
            setResetMessage("Failed to send reset link. Please try again."); 
        } else {
            setResetMessage("Password reset link has been sent to your email. Please check your inbox."); // Success message
            console.log("Reset link sent:", data);
        }
    };

    return (
        <CoverLayout
            title="Forgot Your Password"
            color="white"
            description="Enter your email to receive a password reset link."
        >
            <VuiBox component="form" role="form" onSubmit={ handleResetPassword }>
                <VuiBox mb={2}>
                    <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            Email
                        </VuiTypography>
                    </VuiBox>
                    <VuiInput 
                        type="email" 
                        placeholder="Your email..." 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </VuiBox>
                <VuiBox mt={4} mb={1}>
                    <VuiButton color="info" fullWidth type="submit">
                        Send Reset Link
                    </VuiButton>
                </VuiBox>
                {resetMessage && ( // Conditionally render the message
                    <VuiBox mt={2}>
                        <VuiTypography color="white" fontWeight="small">
                            {resetMessage}
                        </VuiTypography>
                    </VuiBox>
                )}
            </VuiBox>
        </CoverLayout>
    );
};

export default ForgotPassword;
