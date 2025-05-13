import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import logo from '../../assets/logoremasted.png';
import AddProductPage from '../SupplierProducts/AddProductPage';
import SupplierOrders from './SupplierOrderPage';
import ProfileMenu from '../../Components/views/Supplier/ProfileMenu';


// // Edit Profile Dialog Component
// interface EditProfileDialogProps {
//   open: boolean;
//   onClose: () => void;
//   supplierDetails: {
   
//     companyName: string;
//     category: string;
//     address: string;
//     email: string;
//     phoneNumber: string;
   
    
//   };
//   onSave: (updatedDetails: {
//     companyName: string;
//     category: string;
//     address: string;
//     phoneNumber: string;
//   }) => void;
// }

// function EditProfileDialog({ open, onClose, supplierDetails, onSave }: EditProfileDialogProps) {
//   const [formData, setFormData] = React.useState({
//     companyName: supplierDetails.companyName || '',
//     category: supplierDetails.category || '',
//     address: supplierDetails.address || '',
//     phoneNumber: supplierDetails.phoneNumber || '', 
//   });
//   const [errors, setErrors] = React.useState({
//     companyName: '',
//     category: '',
//     address: '',
//     phoneNumber: '',
//   });
//   React.useEffect(() => {
//     setFormData({
//       companyName: supplierDetails.companyName || '',
//       category: supplierDetails.category || '',
//       address: supplierDetails.address || '',
//       phoneNumber: supplierDetails.phoneNumber || '', 
//     });
//     setErrors({
//       companyName: '',
//       category: '',
//       address: '',
//       phoneNumber: '',
//     });
//   }, [supplierDetails]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
    
//   let newValue = value;
//   if (name === 'phoneNumber') {
//     newValue = value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
//   }
//     setFormData(prev => ({
//       ...prev,
//       [name]: newValue,
//     }));
//     setErrors((prev) => ({
//       ...prev,
//       [name]: '',
//     }));
 
//   };
//   const validateForm = () => {
//     const newErrors = {
//       companyName: formData.companyName ? '' : 'Company Name is required',
//       category: formData.category ? '' : 'Category is required',
//       address: formData.address ? '' : 'Address is required',
//       phoneNumber:formData.phoneNumber.length === 10 ? '' : 'Contact Number must be exactly 10 digits',
//     };
//     setErrors(newErrors);
//     return Object.values(newErrors).every((error) => error === '');
//   };

//   const handleSubmit = () => {
//   if (validateForm()) {
//     onSave(formData);
//     onClose();
//   } else {
//     // Focus first invalid field
//     const firstErrorField = Object.keys(errors).find((key) => errors[key as keyof typeof errors]);
//     if (firstErrorField) {
//       const el = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
//       el?.focus();
//     }
//   }
// };
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Edit Profile</DialogTitle>
//       <DialogContent>
//         <TextField
//           margin="normal"
//           name="companyName"
//           label="Company Name"
//           type="text"
//           fullWidth
//           variant="outlined"
//           value={formData.companyName}
//           onChange={handleChange}
//           error={!!errors.companyName}
//           helperText={errors.companyName}
//         />
//         <TextField
//           margin="normal"
//           name="category"
//           label="Category"
//           type="text"
//           fullWidth
//           variant="outlined"
//           value={formData.category}
//           onChange={handleChange}
//           error={!!errors.category}
//          helperText={errors.category}
//         />
//         <TextField
//           margin="normal"
//           name="address"
//           label="Address"
//           type="text"
//           fullWidth
//           variant="outlined"
//           multiline
//           rows={4}
//           value={formData.address}
//           onChange={handleChange}
//           error={!!errors.address}
//           helperText={errors.address}
//         />
//         <TextField
//           margin="normal"
//           name="phoneNumber"
//           label="Contact Number"
//           type="text"
//           fullWidth
//           variant="outlined"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           error={!!errors.phoneNumber}
//           helperText={errors.phoneNumber}
//           inputProps={{
//             maxLength: 10,
//             inputMode: 'numeric',
//             pattern: '[0-9]*',
//           }}
//         />


//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} color="primary" variant="contained">
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }



// Profile Menu Component with Edit Functionality
// function ProfileMenu() {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [editDialogOpen, setEditDialogOpen] = React.useState(false);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
//   const open = Boolean(anchorEl);

//   const supplierDetails = getSupplierDetails();
//   const supplierEmail = supplierDetails?.email || 'supplier@example.com';

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     handleClose();
//     setConfirmDeleteOpen(true); // Open confirmation dialog
//   };

//   const handleEditProfile = () => {
//     handleClose();
//     setEditDialogOpen(true);
//   };

//   const getInitials = (email: string) => {
//     const [localPart, domain] = email.split('@');
//     return `${localPart[0]?.toUpperCase()}${domain[0]?.toUpperCase()}` || 'SU';
//   };

//   return (
//     <React.Fragment>
//       <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
//         <IconButton
//           onClick={handleClick}
//           size="small"
//           sx={{ ml: 2 }}
//           aria-controls={open ? 'account-menu' : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? 'true' : undefined}
//         >
//           <Avatar
//             sx={{
//               width: 32,
//               height: 32,
//               bgcolor: 'primary.secondary',
//               color: 'primary.contrastText',
//             }}
//           >
//             {getInitials(supplierEmail)}
//           </Avatar>
//         </IconButton>
//       </Box>
//       <Menu
//         anchorEl={anchorEl}
//         id="account-menu"
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         PaperProps={{
//           elevation: 0,
//           sx: {
//             overflow: 'visible',
//             filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
//             mt: 1.5,
//             '& .MuiAvatar-root': {
//               width: 32,
//               height: 32,
//               ml: -0.5,
//               mr: 1,
//             },
//             '&:before': {
//               content: '""',
//               display: 'block',
//               position: 'absolute',
//               top: 0,
//               right: 14,
//               width: 10,
//               height: 10,
//               bgcolor: 'background.paper',
//               transform: 'translateY(-50%) rotate(45deg)',
//               zIndex: 0,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <MenuItem onClick={handleClose}>
//           <Avatar /> {supplierEmail}
//         </MenuItem>
//         <Divider />
//         <MenuItem onClick={handleEditProfile}>
//           <ListItemIcon>
//             <Settings fontSize="small" />
//           </ListItemIcon>
//           Edit Profile
//         </MenuItem>

//         <MenuItem onClick={handleLogout}>
//           <ListItemIcon>
//             <Logout fontSize="small" />
//           </ListItemIcon>
//           Sign Out
//         </MenuItem>
//       </Menu>
//     </React.Fragment>
//   );
// }



function AppTitle() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{ height: 50, maxWidth: "auto" }}
      />
    </Box>
  );
}

const NAVIGATION: Navigation = [
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'add-items',
    title: 'Add Items',
    icon: <ShoppingCartIcon />
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
];

const themeColors = {
  primary: '#d4a85f',
  secondary: '#fffff',
  light: '#f8f4e9',
  border: '#e0d6bc',
  darkHover: '#4a381f',
};

const demoTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: themeColors.primary,
      dark: themeColors.darkHover,
    },
    secondary: {
      main: themeColors.secondary,
    },
    background: {
      default: themeColors.light,
      paper: themeColors.light,
    },
    divider: themeColors.border,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.primary,
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: themeColors.primary,
          '&:hover': {
            backgroundColor: themeColors.darkHover,
          },
        },
        containedSecondary: {
          backgroundColor: themeColors.secondary,
          '&:hover': {
            backgroundColor: themeColors.primary,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.light,
          borderColor: themeColors.border,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function OrdersPage() {
  return <SupplierOrders />;
}

function ReportsPage() {
  return <Typography variant="h4">Reports Overview</Typography>;
}

function AddItemPage() {
  return <AddProductPage />;
}

function NotFoundPage() {
  return <Typography variant="h4">Here Your Products</Typography>;
}

function DemoPageContent({ pathname }: { pathname: string }) {
  let ContentComponent;

  switch (pathname) {
    case '/orders':
      ContentComponent = OrdersPage;
      break;
    case '/add-items':
      ContentComponent = AddItemPage;
      break;
    case '/reports':
      ContentComponent = ReportsPage;
      break;
    default:
      ContentComponent = NotFoundPage;
  }

  return (
    <Box sx={{
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <ContentComponent />
    </Box>
  );
}

export default function DashboardLayoutNoMiniSidebar() {
  const router = useDemoRouter('/orders');

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: ProfileMenu,
          appTitle: AppTitle,
        }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

