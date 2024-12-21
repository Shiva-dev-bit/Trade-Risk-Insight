import React, { useState, useEffect } from "react";
import { Card, Divider, IconButton, Button, Grid, Modal, Fade, Backdrop, Box, Typography } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { supabase } from "lib/supabase";
// import gif from "assets/images/cardimgfree.png";
import CloseIcon from '@mui/icons-material/Close';
import  axios  from "axios";
import PropTypes from "prop-types";

const WelcomeMark = ({ stocksData }) => {

  const [companyData, setCompanyData] = useState({
    companyDescription: '',
    CEO: '',
    numberOfEmployees: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    instrumentType: '',
    sector: '',
    industry: '',
    country: '',
    micCode: ''
  });

  
  

  const [open, setOpen] = useState(false);
  const toggleModal = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const fetchProfile = async (symbol) => {
    try {
        // Reset company data if no data is found

        console.log('symbol',symbol);
        const response = await axios.get(`https://rcapidev.neosme.co:2053/company-profile/${symbol}/${stocksData?.exchange}`);
        const companyData = response.data;

        console.log('companyData',companyData);

        setCompanyData({
          companyDescription: companyData?.description,
          CEO: companyData?.CEO,
          numberOfEmployees: companyData?.employees,
          address: companyData?.address,
          address2: companyData?.address2,
          city: companyData?.city,
          state: companyData?.state,
          zip: companyData?.zip,
          phone: companyData?.phone,
          website: companyData?.website,
          instrumentType: companyData?.instrumentType,
          sector: companyData?.sector,
          industry: companyData?.industry,
          country: companyData?.country,
          micCode: companyData?.mic_code
        });
    } catch (error) {
      console.error('Error with request:', error);
    }
  };

  useEffect(() => {
    if (stocksData?.symbol) {
      fetchProfile(stocksData.symbol);
    } else {
      // Reset company data if no data is found
      setCompanyData({
        companyDescription: '',
        CEO: '',
        numberOfEmployees: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        website: '',
        instrumentType: '',
        sector: '',
        industry: '',
        country: '',
        micCode: ''
      });
    }
  }, [stocksData]);

  const getShortDescription = (description) => {
    return description?.length > 120 ? description.substring(0, 120) + '...' : description;
  };

  // console.log(companyData.website);

  return (
    <Card sx={() => ({
      py: "32px",
      px: "24px",
      backgroundSize: "cover",
      backgroundPosition: "50%",
      height: '100%',
      backgroundColor: "#fff",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
    })}>
      <SoftBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <SoftBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SoftTypography color="black" variant="button" fontWeight="bold" mb="12px">
                Company Description:
              </SoftTypography>
              <SoftTypography color="black" variant="h6" fontWeight="regular">
                {getShortDescription(companyData?.companyDescription)}
              </SoftTypography>
            </Grid>
  
            {/* Grid layout for company details */}
            <Grid item xs={12} sm={6} md={6}>
              <SoftTypography color="black" variant="button" fontWeight="bold" mb="6px">
                CEO:
              </SoftTypography>
              <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                {companyData?.CEO}
              </SoftTypography>
            </Grid>
  
            <Grid item xs={12} sm={6} md={6}>
              <SoftTypography color="black" variant="button" fontWeight="bold" mb="6px">
                Website:
              </SoftTypography>
              <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                <a href={`${companyData?.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {companyData?.website}
                </a>
              </SoftTypography>
            </Grid>
  
            <Grid item xs={12} sm={6} md={6}>
              <SoftTypography color="black" variant="button" fontWeight="bold" mb="6px">
                Industry:
              </SoftTypography>
              <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                {companyData?.industry}
              </SoftTypography>
            </Grid>
  
            <Grid item xs={12} sm={6} md={6}>
              <SoftTypography color="black" variant="button" fontWeight="bold" mb="6px">
                Country:
              </SoftTypography>
              <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                {companyData?.country}
              </SoftTypography>
            </Grid>
  
            {companyData?.companyDescription?.length > 100 && (
              <Grid item xs={12} sm={6} md={3}>
                <SoftTypography
                  variant="button"
                  fontWeight="bold"
                  onClick={toggleModal}
                  sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                >
                  Read More
                </SoftTypography>
              </Grid>
            )}
  
            {/* Modal Component */}
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={open}>
                <Box sx={{ ...style, width: '80%', maxWidth: '1000px', borderRadius: '10px', background: '#fff', boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 8, right: 8, background: '#eee' }}
                  >
                    <CloseIcon />
                  </IconButton>
  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <SoftTypography id="transition-modal-title" variant="h6" component="h2" color="black">
                        Company Description
                      </SoftTypography>
  
                      <SoftTypography color="black" variant="h6" fontWeight="regular" mt={2} sx={{ textAlign: 'justify' }}>
                        {companyData?.companyDescription?.length > 1000
                          ? companyData?.companyDescription?.substring(0, 1000) + '....'
                          : companyData?.companyDescription}
                      </SoftTypography>
                    </Grid>
  
                    {/* Right side - Company Details */}
                    <Grid item xs={12} md={6} container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="bold" mb="6px">
                          CEO:
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.CEO}
                        </SoftTypography>
                      </Grid>
  
                      {/* Number of Employees */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Number of Employees:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.numberOfEmployees}
                        </SoftTypography>
                      </Grid>

                      {/* Address */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Address:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.address} {companyData?.address2}
                        </SoftTypography>
                      </Grid>

                      {/* Phone */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Phone:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.phone}
                        </SoftTypography>
                      </Grid>

                      {/* Website */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Website:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          <a
                            href={companyData?.website} 
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {companyData?.website}
                          </a>
                        </SoftTypography>

                      </Grid>

                      {/* Instrument Type */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Instrument Type:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.instrumentType}
                        </SoftTypography>
                      </Grid>

                      {/* Sector */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Sector:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.sector}
                        </SoftTypography>
                      </Grid>

                      {/* Industry */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Industry:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.industry}
                        </SoftTypography>
                      </Grid>

                      {/* Country */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>Country:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.country}
                        </SoftTypography>
                      </Grid>

                      {/* MIC Code */}
                      <Grid item xs={12} sm={6}>
                        <SoftTypography color="black" variant="button" fontWeight="regular" mb="6px">
                          <strong>MIC Code:</strong>
                        </SoftTypography>
                        <SoftTypography color="black" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.micCode}
                        </SoftTypography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Modal>
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
  
};


WelcomeMark.propTypes = {
  stocksData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Example: replace 'id' with the actual key from your stocksData
      name: PropTypes.string.isRequired, // Replace 'name' with the actual key
      price: PropTypes.number, // Example key, update as per your data structure
    })
  ).isRequired,
};

export default WelcomeMark;
