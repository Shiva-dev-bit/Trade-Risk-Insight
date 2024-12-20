// layouts/authentication/reset-password.js

import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { supabase } from 'lib/supabase';
import {useNavigate } from 'react-router-dom';
import curved9 from "assets/images/curved-images/curved-6.jpg";


const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const history = useNavigate();

      

    const handlePasswordReset = async (e) => {
        e.preventDefault();

    
        setLoading(true);
        console.log('Attempting to reset password...'); 
    
        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });
    
            if (error) {
                console.error('Error updating password:', error.message); 
                throw error;
            }else{
                console.log('Password updated successfully!'); 
                setMessage('Password has been reset successfully!');
                setError(null);
                history.push('/dashboard');
            }
    
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
            image={curved9}
        >
            <SoftBox component="form" role="form" onSubmit={handlePasswordReset}>
                {error && (
                    <SoftTypography variant="button" color="error" fontWeight="medium">
                        {error}
                    </SoftTypography>
                )}
                {message && (
                    <SoftTypography variant="button" color="success" fontWeight="medium">
                        {message}
                    </SoftTypography>
                )}
                
                <SoftBox mb={2} mt={2}>
                    <SoftBox mb={1} ml={0.5}>
                        <SoftTypography component="label" variant="button" color="white" fontWeight="medium">
                            New Password
                        </SoftTypography>
                    </SoftBox>
                    
                    <SoftInput
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </SoftBox>
                
                <SoftBox mt={4} mb={1}>
                    <SoftButton color="info" fullWidth type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </SoftButton>
                </SoftBox>
            </SoftBox>
        </CoverLayout>
    );
};

export default ResetPassword;
