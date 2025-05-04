import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  styled,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { createSupplier } from '../../api/supplierApi';
import { getSupplierDetails } from '../../customHooks/supplierEmailextract';

// Define your theme colors
const themeColors = {
  primary: '#d4a85f',
  secondary: '#ffffff',
  light: '#f8f4e9',
  border: '#e0d6bc',
  darkHover: '#4a381f',
};

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: themeColors.primary,
    },
    secondary: {
      main: themeColors.secondary,
    },
    background: {
      default: themeColors.light,
    },
  },
});

const steps = ['Welcome', 'Company Info', 'Contact', 'Review'];

const ColorButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${themeColors.primary} 30%, ${themeColors.darkHover} 90%)`,
  border: 0,
  borderRadius: 8,
  color: themeColors.secondary,
  height: 48,
  padding: '0 30px',
  boxShadow: `0 3px 5px 2px rgba(212, 168, 95, .3)`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 5px 8px 2px rgba(212, 168, 95, .4)`,
    background: `linear-gradient(45deg, ${themeColors.darkHover} 30%, ${themeColors.primary} 90%)`,
  },
}));

const categories = [
  'Decoration And Balloon',
  'Photography',
  'Furniture And Seating',
  'Floral Decoration'
];

const AnimatedPaper = motion(Paper);

const SupplierOnboardingForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const supplierDetails = getSupplierDetails()
  const supplierEmail = supplierDetails?.email;

  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    address: '',
    supplierEmail: supplierEmail || '',
  });

  const handleNext = async () => {
    if (activeStep === 1) {
      if (!formData.companyName || !formData.category || !formData.address) {
        setError('Please fill all required fields');
        return;
      }
    }

    if (activeStep === 2) {
      if (!formData.supplierEmail) {
        setError('Email is required');
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.supplierEmail)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      companyName: '',
      category: '',
      address: '',
      supplierEmail: ''
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createSupplier(formData);
      setActiveStep(steps.length);
      setTimeout(() => {
        navigate('/supplier/SupplierPage');
      }, 2000);
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{
                mb: 3,
                background: `linear-gradient(45deg, ${themeColors.primary} 30%, ${themeColors.darkHover} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                Welcome to Our Supplier Network
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Join our exclusive network of premium event suppliers. Let's get you onboarded in just a few simple steps.
              </Typography>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/assets/supplier-welcome.svg"
                  alt="Welcome"
                  sx={{ width: '60%', maxWidth: 300, mt: 2 }}
                />
              </motion.div>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Zoom in={true} timeout={300}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{
                mb: 3,
                color: themeColors.primary,
                fontWeight: 'medium'
              }}>
                Company Details
              </Typography>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth margin="normal" required sx={{ mb: 2 }}>
                <InputLabel>Service Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as string })}
                  label="Service Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Business Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                margin="normal"
                required
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Box>
          </Zoom>
        );
      case 2:
        return (
          <Zoom in={true} timeout={300}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{
                mb: 3,
                color: themeColors.primary,
                fontWeight: 'medium'
              }}>
                Contact Information
              </Typography>
              <TextField
                fullWidth
                label="Business Email"
                name="supplierEmail"
                type="email"
                value={formData.supplierEmail}
                onChange={handleInputChange}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Zoom>
        );
      case 3:
        return (
          <Fade in={true} timeout={500}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{
                mb: 3,
                color: themeColors.primary,
                fontWeight: 'medium'
              }}>
                Review Your Information
              </Typography>
              <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2, 
                bgcolor: themeColors.light,
                border: `1px solid ${themeColors.border}`
              }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Company Details
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Name:</strong> {formData.companyName || 'Not provided'}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Category:</strong> {formData.category || 'Not provided'}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Address:</strong> {formData.address || 'Not provided'}
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'medium' }}>
                  Contact Information
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Email:</strong> {formData.supplierEmail || 'Not provided'}
                </Typography>
              </Paper>
              <Typography variant="body2" color="text.secondary">
                Please verify all information is correct before submitting.
              </Typography>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ 
        py: 4,
        background: themeColors.light,
        minHeight: '100vh'
      }}>
        <AnimatedPaper
          elevation={6}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            background: themeColors.secondary,
            border: `1px solid ${themeColors.border}`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': {
                fontWeight: '500',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: themeColors.primary,
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: themeColors.primary,
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/assets/success-checkmark.svg"
                  alt="Success"
                  sx={{ width: 100, height: 100, mb: 3 }}
                />
              </motion.div>
              <Typography variant="h5" gutterBottom sx={{
                mb: 2,
                background: `linear-gradient(45deg, ${themeColors.primary} 30%, ${themeColors.darkHover} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                Application Submitted!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Thank you for your application. Our team will review your information and contact you within 2-3 business days.
              </Typography>
            </Box>
          ) : (
            <>
              {getStepContent(activeStep)}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 2,
                mt: 2
              }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    mr: 1,
                    borderRadius: 2,
                    px: 3,
                    textTransform: 'none',
                    color: themeColors.primary,
                    '&:hover': {
                      backgroundColor: 'rgba(252, 156, 0, 0.08)'
                    }
                  }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <ColorButton
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      textTransform: 'none'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Submit Application'
                    )}
                  </ColorButton>
                ) : (
                  <ColorButton
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      textTransform: 'none'
                    }}
                  >
                    Continue
                  </ColorButton>
                )}
              </Box>
            </>
          )}
        </AnimatedPaper>
      </Container>
    </ThemeProvider>
  );
};

export default SupplierOnboardingForm;