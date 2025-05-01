import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserService from '../User/UserService';
import companyLogo from '../../../assets/logoremasted.png';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Divider,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    useMediaQuery,
    useTheme,
    Tooltip,
    Stack
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Info as InfoIcon,
    ArrowForward as ArrowForwardIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { checkEmailAvailability } from '../../../api/supplierApi';

interface TokenPayload {
    exp: number;
    [key: string]: any;
}

interface User {
    name?: string;
    email?: string;
    [key: string]: any;
}

interface LoginResponse {
    token: string;
    role: string;
    user?: User;
    isNewSupplier?: boolean;
}

// Define theme colors for consistency
const themeColors = {
    primary: '#614a29',
    secondary: '#d4a85f',
    light: '#f8f4e9',
    border: '#e0d6bc',
    darkHover: '#4a381f',
};

export default function SupplierLogin() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const decodeToken = (token: string): TokenPayload | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            const response = await UserService.login(email, password) as LoginResponse;
            console.log('Login API Response:', response);

            const supplierEmailExists = await checkEmailAvailability(email);
            console.log('Email availability check:', supplierEmailExists);
    
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
    
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('name', response.user.name || '');
                    localStorage.setItem('email', response.user.email || '');
                }
    
                // Only allow suppliers to proceed
                if (response.role !== 'SUPPLIER') {
                    // Clear any stored data
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('user');
                    localStorage.removeItem('name');
                    localStorage.removeItem('email');
                    
                    throw new Error('Access restricted to suppliers only. Please use the appropriate login portal.');
                }
    
                // Only suppliers reach this point
                if(supplierEmailExists){
                    navigate('/supplier/SupplierPage');
                }
                else{
                    navigate('/supplier/supplierOnboardingForm')
                }
            } else {
                throw new Error('Authentication failed - no token received');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{
            py: { xs: 4, md: 8 },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 8px 40px rgba(97, 74, 41, 0.12)'
                    }}
                >
                    <Stack direction="row" >
                        {/* Left side - Brand info */}
                        <Box>
                            <Box
                                sx={{
                                    p: { xs: 4, md: 6 },
                                    zIndex: 1,
                                    position: 'relative',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mb: 4
                                    }}>
                                        <motion.div
                                            whileHover={{ rotate: 5, scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                background: 'rgba(255,255,255,0.15)',
                                                padding: '16px',
                                                borderRadius: '50%',
                                                backdropFilter: 'blur(10px)',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                                border: '2px solid rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            <img
                                                src={companyLogo}
                                                alt="Festivo Logo"
                                                style={{ height: 60, width: 'auto', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = 'https://via.placeholder.com/150?text=Festivo';
                                                }}
                                            />
                                        </motion.div>
                                    </Box>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    >
                                        <Typography variant="h3" component="h1" sx={{
                                            fontWeight: 800,
                                            textAlign: 'center',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}>
                                            Supplier Portal
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            mt: 2,
                                            color: themeColors.secondary,
                                            textAlign: 'center',
                                            fontWeight: 500
                                        }}>
                                            Connect with event planners worldwide
                                        </Typography>
                                    </motion.div>
                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    <Card sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: 'none',
                                        borderRadius: 2
                                    }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <InfoIcon sx={{ color: themeColors.secondary, mr: 2, mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
                                                    New to Festivo?
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'gray' }}>
                                                    First-time suppliers will complete a quick application to activate your account and join our network.
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        </Box>

                        {/* Right side - Login form */}
                        <Box >
                            <Box
                                sx={{
                                    p: { xs: 4, md: 6 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <Typography variant="h4" component="h2" sx={{
                                        fontWeight: 700,
                                        color: themeColors.primary,
                                        mb: 3
                                    }}>
                                        Welcome Back
                                    </Typography>

                                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                                        Sign in to access your supplier dashboard and manage your business with Festivo.
                                    </Typography>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Alert
                                                severity="error"
                                                sx={{
                                                    mb: 3,
                                                    borderRadius: 2,
                                                    '& .MuiAlert-icon': {
                                                        color: '#d32f2f'
                                                    }
                                                }}
                                            >
                                                {error}
                                            </Alert>
                                        </motion.div>
                                    )}

                                    <Box component="form" onSubmit={handleSubmit}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Business Email"
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon sx={{ color: themeColors.primary }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                mb: 3,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '& fieldset': {
                                                        borderColor: themeColors.border,
                                                        borderWidth: 2,
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: themeColors.secondary,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: themeColors.primary,
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: themeColors.primary,
                                                    '&.Mui-focused': {
                                                        color: themeColors.primary,
                                                    }
                                                }
                                            }}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: themeColors.primary }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{ color: themeColors.primary }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                mb: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '& fieldset': {
                                                        borderColor: themeColors.border,
                                                        borderWidth: 2,
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: themeColors.secondary,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: themeColors.primary,
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: themeColors.primary,
                                                    '&.Mui-focused': {
                                                        color: themeColors.primary,
                                                    }
                                                }
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: themeColors.primary,
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                            color: themeColors.darkHover,
                                                        }
                                                    }}
                                                >
                                                    Forgot password?
                                                </Typography>
                                            </Link>
                                        </Box>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    mt: 2,
                                                    mb: 3,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: themeColors.primary,
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 4px 12px rgba(97, 74, 41, 0.2)',
                                                    '&:hover': {
                                                        bgcolor: themeColors.darkHover,
                                                        boxShadow: '0 6px 16px rgba(97, 74, 41, 0.3)',
                                                    },
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                                ) : (
                                                    <>
                                                        Login to Dashboard
                                                        <ArrowForwardIcon sx={{ ml: 1 }} />
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>

                                        <Divider sx={{
                                            my: 3,
                                            borderColor: themeColors.border,
                                            '&::before, &::after': {
                                                borderColor: themeColors.border,
                                            }
                                        }}>
                                            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>OR</Typography>
                                        </Divider>

                                        <Box sx={{ textAlign: 'center' }}>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    component={Link}
                                                    to="/SupplierSignup"
                                                    variant="outlined"
                                                    startIcon={<BusinessIcon />}
                                                    sx={{
                                                        py: 1.2,
                                                        px: 4,
                                                        borderRadius: 2,
                                                        borderColor: themeColors.secondary,
                                                        color: themeColors.primary,
                                                        borderWidth: 2,
                                                        '&:hover': {
                                                            borderColor: themeColors.primary,
                                                            bgcolor: 'rgba(97, 74, 41, 0.05)',
                                                            borderWidth: 2,
                                                        },
                                                    }}
                                                >
                                                    Sign Up as Supplier
                                                </Button>
                                            </motion.div>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: themeColors.primary }}>
                        By logging in, you agree to our{' '}
                        <Link to="/terms" style={{
                            color: themeColors.primary,
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" style={{
                            color: themeColors.primary,
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            Privacy Policy
                        </Link>
                    </Typography>
                </Box>
            </motion.div>
        </Container>
    );
}
