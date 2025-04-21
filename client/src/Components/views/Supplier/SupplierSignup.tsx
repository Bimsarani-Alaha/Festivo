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
    Grid,
    ThemeProvider,
    createTheme
} from "@mui/material";
import {
    Business as BusinessIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    CheckCircle as CheckCircleIcon,
    AdminPanelSettings as AdminIcon
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
    role: "USER" | "SUPPLIER";
};

type FormErrors = {
    name?: string;
    email?: string;
    gender?: string;
    phoneNumber?: string;
    password?: string;
};

const SupplierSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        gender: "",
        phoneNumber: "",
        password: "",
        role: "SUPPLIER" // Force as SUPPLIER
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showSecretKeyModal, setShowSecretKeyModal] = useState(true);
    const [secretKeyInput, setSecretKeyInput] = useState("");
    const [secretKeyError, setSecretKeyError] = useState("");

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const verifySecretKey = () => {
        if (secretKeyInput === "festivo") {
            setShowSecretKeyModal(false);
            setSecretKeyError("");
        } else {
            setSecretKeyError("Invalid secret key. Please try again.");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setApiError("");

        try {
            await UserService.register(formData);
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
        navigate("/login");
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
                {/* Secret Key Modal */}
                <Dialog open={showSecretKeyModal} onClose={() => navigate("/")} PaperProps={{ elevation: 8 }}>
                    <Stack spacing={2} sx={{ p: 4 }}>
                        <Avatar sx={{
                            mx: 'auto',
                            bgcolor: 'primary.main',
                            width: 60,
                            height: 60,
                            boxShadow: '0px 4px 10px rgba(97, 74, 41, 0.3)'
                        }}>
                            <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                        </Avatar>

                        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 600 }}>
                            Admin Verification
                        </Typography>
                        <Typography sx={{ textAlign: 'center' }}>
                            This area is restricted to Festivo administrators only.
                            Please enter your admin key to access supplier registration.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Admin Key"
                            type="password"
                            value={secretKeyInput}
                            onChange={(e) => setSecretKeyInput(e.target.value)}
                            error={!!secretKeyError}
                            helperText={secretKeyError}
                            autoFocus
                            variant="outlined"
                        />
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/")}
                                sx={{ px: 4 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={verifySecretKey}
                                disabled={!secretKeyInput}
                                sx={{ px: 4 }}
                            >
                                Verify
                            </Button>
                        </Stack>
                    </Stack>
                </Dialog>

                {/* Main Content - Split Layout */}
                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                    <Stack direction="row" spacing={2} sx={{maxHeight: '600px'}} >
                        {/* Left Side - Introduction and Logo */}
                        <Grid  item xs={12} md={5}
                              sx={{
                                  bgcolor: 'primary.main',
                                  backgroundImage: 'linear-gradient(135deg, #614a29 0%, #8b6d3d 100%)',
                                  color: 'white',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  p: 6
                              }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 2, maxWidth:'550px' }}>
                                {/* Logo */}
                                <Box sx={{ mb: 6, textAlign: 'center' }}>
                                    <Avatar sx={{
                                        mx: 'auto',
                                        bgcolor: '#ffffff',
                                        width: 120,
                                        height: 120,
                                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)'
                                    }}>
                                        <img src={logo} alt="Festivo logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                    </Avatar>
                                </Box>

                                {/* Introduction Text */}
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    Supplier Registration Portal
                                </Typography>

                                <Typography variant="body1" sx={{ mt: 3, mb: 4, lineHeight: 1.8 }}>
                                    As a Festivo administrator, you can register new suppliers who will provide
                                    services for events. Once registered, suppliers will receive their login
                                    credentials and access to the supplier dashboard.
                                </Typography>

                                {/* Decorative Elements */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mt: 4,
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <BusinessIcon sx={{ fontSize: 40 }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={500}>
                                            Expand Your Network
                                        </Typography>
                                        <Typography variant="body2">
                                            Help suppliers join the Festivo ecosystem and grow their business
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Decorative Background Pattern */}
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
                        </Grid>

                        {/* Right Side - Form */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ p: 6 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
                                    <AdminIcon color="primary" />
                                    <Typography variant="h6" color="primary" fontWeight={500}>
                                        Admin: Create New Supplier Account
                                    </Typography>
                                </Stack>

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Stack spacing={3}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Supplier Full Name"
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
                                            label="Supplier Email Address"
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

                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                            <FormControl fullWidth required error={!!errors.gender}>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    label="Gender"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="MALE">Male</MenuItem>
                                                    <MenuItem value="FEMALE">Female</MenuItem>
                                                    <MenuItem value="OTHER">Other</MenuItem>
                                                </Select>
                                                {errors.gender && <Typography variant="caption" color="error">{errors.gender}</Typography>}
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
                                                    } as unknown as ChangeEvent<HTMLInputElement>);
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
                                            helperText={errors.password || "Supplier will use this to log in initially (minimum 8 characters)"}
                                            InputProps={{
                                                startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{ py: 1.5 }}
                                            disabled={isSubmitting || showSecretKeyModal}
                                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <BusinessIcon />}
                                        >
                                            {isSubmitting ? "Registering Supplier..." : "Register New Supplier"}
                                        </Button>

                                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => navigate("/admin-dashboard")}
                                                sx={{ px: 4 }}
                                            >
                                                Return to Admin Dashboard
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Grid>
                    </Stack>
                </Paper>

                {/* Success Dialog */}
                <Dialog
                    open={showSuccessModal}
                    onClose={handleCloseSuccessModal}
                    PaperProps={{
                        sx: { borderRadius: 3, p: 1 }
                    }}
                >
                    <Stack spacing={2} sx={{ p: 4, textAlign: 'center' }}>
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
                            Supplier Registered!
                        </Typography>
                        <Typography>
                            The supplier account has been created successfully.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Login credentials will be sent to the provided email address.
                            The supplier can now access the Festivo platform.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCloseSuccessModal}
                            sx={{ mt: 2, px: 4, mx: 'auto' }}
                        >
                            Return to Admin Dashboard
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