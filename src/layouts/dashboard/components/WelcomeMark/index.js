import React, { useState, useEffect } from "react";
import { Card, Divider, IconButton, Button, Grid, Modal, Fade, Backdrop, Box, Typography } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { supabase } from "lib/supabase";
import gif from "assets/images/cardimgfree.png";
import CloseIcon from '@mui/icons-material/Close';
import  axios  from "axios";

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
      height : '100%'
    })}>
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <VuiBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px">
                <strong>Company Description:</strong>
              </VuiTypography>
              <VuiTypography color="white" variant="h6" fontWeight="regular">
                {getShortDescription(companyData?.companyDescription)}
              </VuiTypography>
            </Grid>

            {/* Grid layout for company details */}
            <Grid item xs={12} sm={6} md={6}>
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                <strong>CEO:</strong>
              </VuiTypography>
              <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                {companyData?.CEO}
              </VuiTypography>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                <strong>Website:</strong>
              </VuiTypography>
              <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                <a href={`${companyData?.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {companyData?.website}
                </a>
              </VuiTypography>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                <strong>Industry:</strong>
              </VuiTypography>
              <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                {companyData?.industry}
              </VuiTypography>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                <strong>Country:</strong>
              </VuiTypography>
              <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                {companyData?.country}
              </VuiTypography>
            </Grid>

            {companyData?.companyDescription?.length > 100 && (
              <Grid item xs={12} sm={6} md={3}>
                <VuiTypography
                  variant="button"
                  fontWeight="bold"
                  onClick={toggleModal}
                  sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'rgb(51, 51, 184)' }}
                >
                  Read More
                </VuiTypography>
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
                <Box sx={{ ...style, width: '80%', maxWidth: '1000px', borderRadius: '10px', background: 'linear-gradient(135deg, #030C1D, #1E3A5F)' }}>
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 8, right: 8, background: 'rgb(51, 51, 184)' }}
                  >
                    <CloseIcon />
                  </IconButton>


                  <Grid container spacing={3} sx={{ display: 'flex' }}>
                    <Grid item xs={12} md={6}>
                      <VuiTypography id="transition-modal-title" variant="h6" component="h2" color="white">
                        Company Description
                      </VuiTypography>

                      <VuiTypography color="white" variant="h6" fontWeight="regular" mt={2} sx={{ textAlign: 'justify' }}>
                        {companyData?.companyDescription?.length > 1000 ? companyData?.companyDescription?.substring(0, 1000) + '....' : companyData?.companyDescription}
                      </VuiTypography>
                    </Grid>

                    {/* Right side - Company Details */}
                    <Grid item xs={12} md={6} container spacing={2}> {/* Takes the other half of the width */}

                      {/* CEO */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white"
                          variant="button"
                          fontWeight="regular"
                          mb="6px"
                          sx={{ fontWeight: 'bold' }}>
                          <strong>CEO:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.CEO}
                        </VuiTypography>
                      </Grid>

                      {/* Number of Employees */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Number of Employees:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.numberOfEmployees}
                        </VuiTypography>
                      </Grid>

                      {/* Address */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Address:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.address} {companyData?.address2}
                        </VuiTypography>
                      </Grid>

                      {/* Phone */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Phone:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.phone}
                        </VuiTypography>
                      </Grid>

                      {/* Website */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Website:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          <a
                            href={companyData?.website} 
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {companyData?.website}
                          </a>
                        </VuiTypography>

                      </Grid>

                      {/* Instrument Type */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Instrument Type:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.instrumentType}
                        </VuiTypography>
                      </Grid>

                      {/* Sector */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Sector:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.sector}
                        </VuiTypography>
                      </Grid>

                      {/* Industry */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Industry:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.industry}
                        </VuiTypography>
                      </Grid>

                      {/* Country */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>Country:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.country}
                        </VuiTypography>
                      </Grid>

                      {/* MIC Code */}
                      <Grid item xs={12} sm={6}>
                        <VuiTypography color="white" variant="button" fontWeight="regular" mb="6px">
                          <strong>MIC Code:</strong>
                        </VuiTypography>
                        <VuiTypography color="white" variant="h6" fontWeight="regular" mb="8px">
                          {companyData?.micCode}
                        </VuiTypography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>

            </Modal>

          </Grid>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;
