import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../User/UserService.ts";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Stack,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    CircularProgress,
    Snackbar,
    Alert,
    ThemeProvider,
    createTheme
} from "@mui/material";
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    CheckCircle as CheckCircleIcon,
    StorefrontOutlined as SupplierIcon
} from "@mui/icons-material";

import logo from '../../../assets/logoremasted.png'

// Custom theme with Festivo colors
const theme = createTheme({
    palette: {
        primary: {
            main: "#614a29",
            contrastText: "#fff"
        },
        secondary: {
            main: "#d4a85f",
            contrastText: "#fff"
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff"
        }
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 8px rgba(97, 74, 41, 0.2)',
                    }
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #614a29 30%, #6e5633 90%)',
                },
                containedSecondary: {
                    background: 'linear-gradient(45deg, #d4a85f 30%, #e0b46a 90%)',
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
                    borderRadius: 16
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8
                    }
                }
            }
        }
    }
});

type FormData = {
    name: string;
    email: string;
    gender: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    role: "SUPPLIER";
};

type FormErrors = {
    name?: string;
    email?: string;
    gender?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
};

const SupplierSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        gender: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "SUPPLIER" // Default role is SUPPLIER
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.gender) newErrors.gender = "Please select gender";
        if (!formData.phoneNumber.match(/^\d{10}$/)) {
            newErrors.phoneNumber = "Please enter a valid 10-digit number";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setApiError("");

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...dataToSubmit } = formData;
            await UserService.register(dataToSubmit);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error("Registration error:", error);
            setApiError(error.response?.data?.message || "Registration failed. Please try again.");
            setOpenSnackbar(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate("/SupplierLogin");
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
                <Stack spacing={4}>
                    {/* Main Content */}
                    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '600px' }}>
                            {/* Left Side - Introduction */}
                            <Box
                                sx={{
                                    bgcolor: 'primary.main',
                                    backgroundImage: 'linear-gradient(135deg, #614a29 0%, #8b6d3d 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    p: { xs: 4, md: 6 },
                                    flex: { xs: '0 0 auto', md: '0 0 40%' }
                                }}
                            >
                                <Stack spacing={4} sx={{ position: 'relative', zIndex: 2, maxWidth: '550px' }}>
                                    {/* Logo */}
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Avatar sx={{
                                            mx: 'auto',
                                            bgcolor: '#ffffff',
                                            width: 100,
                                            height: 100,
                                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)'
                                        }}>
                                            <img src={logo} alt="Festivo logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                        </Avatar>
                                    </Box>

                                    {/* Introduction Text */}
                                    <Typography variant="h4" fontWeight="bold" textAlign="center">
                                        Supplier Registration
                                    </Typography>

                                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                        Join the Festivo network as a supplier and grow your event service business. 
                                        Create your account today to connect with event planners and showcase your services.
                                    </Typography>

                                    {/* Benefits */}
                                    <Stack spacing={2}>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <Typography fontWeight={500}>
                                                ✓ Access to event planners looking for your services
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <Typography fontWeight={500}>
                                                ✓ Simple dashboard to manage your offerings
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <Typography fontWeight={500}>
                                                ✓ Grow your business with our platform
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Stack>

                                {/* Background Pattern */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0.1,
                                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                    zIndex: 1
                                }} />
                            </Box>

                            {/* Right Side - Form */}
                            <Box sx={{ flex: 1, p: { xs: 3, sm: 6 } }}>
                                <Stack spacing={4}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <SupplierIcon color="primary" />
                                        <Typography variant="h6" color="primary" fontWeight={500}>
                                            Create Your Supplier Account
                                        </Typography>
                                    </Stack>

                                    <Box component="form" onSubmit={handleSubmit}>
                                        <Stack spacing={3}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                error={!!errors.name}
                                                helperText={errors.name}
                                                InputProps={{
                                                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                                                }}
                                            />

                                            <TextField
                                                required
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                InputProps={{
                                                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                                                }}
                                            />

                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <FormControl fullWidth required error={!!errors.gender}>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        label="Gender"
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={(e) => {
                                                            handleChange({
                                                                target: {
                                                                    name: 'gender',
                                                                    value: e.target.value
                                                                }
                                                            } as ChangeEvent<HTMLInputElement>);
                                                        }}
                                                    >
                                                        <MenuItem value="MALE">Male</MenuItem>
                                                        <MenuItem value="FEMALE">Female</MenuItem>
                                                        <MenuItem value="OTHER">Other</MenuItem>
                                                    </Select>
                                                    {errors.gender && (
                                                        <Typography variant="caption" color="error">
                                                            {errors.gender}
                                                        </Typography>
                                                    )}
                                                </FormControl>

                                                <TextField
                                                    required
                                                    fullWidth
                                                    label="Phone Number"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        handleChange({
                                                            target: {
                                                                name: e.target.name,
                                                                value: value
                                                            }
                                                        } as ChangeEvent<HTMLInputElement>);
                                                    }}
                                                    error={!!errors.phoneNumber}
                                                    helperText={errors.phoneNumber}
                                                    InputProps={{
                                                        startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                                                    }}
                                                    inputProps={{
                                                        maxLength: 10,
                                                        inputMode: 'numeric'
                                                    }}
                                                />
                                            </Stack>

                                            <TextField
                                                required
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                error={!!errors.password}
                                                helperText={errors.password || "Must be at least 8 characters"}
                                                InputProps={{
                                                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />
                                                }}
                                            />

                                            <TextField
                                                required
                                                fullWidth
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword}
                                                InputProps={{
                                                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                sx={{ py: 1.5, mt: 2 }}
                                                disabled={isSubmitting}
                                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SupplierIcon />}
                                            >
                                                {isSubmitting ? "Creating Account..." : "Sign Up as Supplier"}
                                            </Button>
                                        </Stack>
                                    </Box>

                                    <Stack direction="row" justifyContent="center" spacing={1}>
                                        <Typography variant="body2">
                                            Already have an account?
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="secondary" 
                                            sx={{ 
                                                fontWeight: 600, 
                                                cursor: 'pointer',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                            onClick={() => navigate("/SupplierLogin")}
                                        >
                                            Log in
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>

                {/* Success Dialog */}
                <Dialog
                    open={showSuccessModal}
                    onClose={handleCloseSuccessModal}
                    PaperProps={{
                        sx: { borderRadius: 3, p: 1 }
                    }}
                >
                    <Stack spacing={3} sx={{ p: 4, textAlign: 'center' }}>
                        <Avatar sx={{
                            mx: 'auto',
                            bgcolor: '#4caf50',
                            width: 70,
                            height: 70,
                            boxShadow: '0px 4px 20px rgba(76, 175, 80, 0.3)'
                        }}>
                            <CheckCircleIcon sx={{ fontSize: 50 }} />
                        </Avatar>
                        <Typography variant="h5" fontWeight={600}>
                            Registration Successful!
                        </Typography>
                        <Typography>
                            Your supplier account has been created successfully.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You can now log in with your credentials to access the Festivo supplier dashboard.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCloseSuccessModal}
                            sx={{ mt: 2, px: 4, mx: 'auto' }}
                        >
                            Go to Login
                        </Button>
                    </Stack>
                </Dialog>

                {/* Error Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        severity="error"
                        onClose={handleCloseSnackbar}
                        sx={{ width: '100%' }}
                    >
                        {apiError}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default SupplierSignup;