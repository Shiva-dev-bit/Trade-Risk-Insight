// layouts/authentication/reset-password.js

import React, { useEffect, useState } from 'react';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiInput from 'components/VuiInput';
import VuiButton from 'components/VuiButton';
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { supabase } from 'lib/supabase';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

      

    const handlePasswordReset = async (e) => {
        e.preventDefault();
    
        setLoading(true);
        console.log('Attempting to reset password...'); 
    
        try {
            const { error } = await supabase.auth.updateUser({
                email,
                password,
            });
    
            if (error) {
                console.error('Error updating password:', error.message); 
                throw error;
            }
    
            console.log('Password updated successfully!'); 
            setMessage('Password has been reset successfully!');
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <CoverLayout
            title="Reset Password"
            color="white"
            description="Enter your new password to reset it."
        >
            <VuiBox component="form" role="form" onSubmit={handlePasswordReset}>
                {error && (
                    <VuiTypography variant="button" color="error" fontWeight="medium">
                        {error}
                    </VuiTypography>
                )}
                {message && (
                    <VuiTypography variant="button" color="success" fontWeight="medium">
                        {message}
                    </VuiTypography>
                )}
                
                <VuiBox mb={2} mt={2}>
                    <VuiBox mb={1} ml={0.5}>
                        <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                            New Password
                        </VuiTypography>
                    </VuiBox>

                    <VuiBox mb={1} ml={0.5}>
                    <VuiInput
                        type="email"
                        placeholder="Enter the Mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </VuiBox>
                    
                    <VuiInput
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </VuiBox>
                
                <VuiBox mt={4} mb={1}>
                    <VuiButton color="info" fullWidth type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </VuiButton>
                </VuiBox>
            </VuiBox>
        </CoverLayout>
    );
};

export default ResetPassword;
