import React from 'react';
import {
  Container,
  Typography,
  Box,
  Link,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Navbar from './Navbar';

const Support = () => (
  <>
    {/* Navbar */}
    <Navbar title="Support" backButton showBottomNav={false} />

    {/* Page Content */}
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F9F9FB',
        pt: 10,
        pb: 5,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 } }}>
          {/* Heading */}
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            Support
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" paragraph>
            If you have questions or issues with Travel Trails, we’re here to help.
          </Typography>

          {/* Contact Options */}
          <Box sx={{ mt: 3, mb: 5 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1 }} color="primary" />
              <Typography>
                Email:{' '}
                <Link href="mailto:support@traveltrace.com" underline="hover">
                  support@traveltrace.com
                </Link>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 1 }} color="primary" />
              <Typography>
                Phone:{' '}
                <Link href="tel:+94123456789" underline="hover">
                  +94-123-456-789
                </Link>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} color="primary" />
              <Typography>Address: 123 Trail Street, Colombo, Sri Lanka</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Our support team typically replies within 24 hours on business days.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* FAQs / Common Problems */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Frequently Asked Questions
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">
                How do I create a new trail?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Navigate to the "Create Trail" section using the menu. Add a name,
                description, and optionally upload photos, videos, and articles. Then click
                "Save Trail."
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">
                Can I edit or delete a trail after publishing?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes. Go to your profile, click on the trail, and use the "Edit" or "Delete"
                options available on the trail page.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">
                Why aren’t my uploaded images showing properly?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Ensure the image is in JPG or PNG format and below 5MB. If problems
                persist, try clearing your cache or contact support.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">
                Is my trail content visible to everyone?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                By default, trails are public. You can make them private by changing
                visibility settings while editing the trail.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">
                How can I report inappropriate content?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                On any trail, click the "Report" button. Fill out the form and our
                moderation team will review it within 24 hours.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Container>
    </Box>
  </>
);

export default Support;
