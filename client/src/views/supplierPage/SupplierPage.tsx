import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import Avatar from '@mui/material/Avatar';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import logo from '../../assets/logoremasted.png';
import AddProductPage from '../SupplierProducts/AddProductPage';
import SupplierOrders from './SupplierOrderPage';
import { getSupplierDetails } from '../../customHooks/supplierEmailextract';

const supplierDetails = getSupplierDetails();
const supplierEmail = supplierDetails?.email || 'supplier@example.com'; // Fallback email

function AppTitle() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{ height: 50, maxWidth: "auto" }}
      />
      <Typography variant="h6" noWrap>
        Supplier
      </Typography>
    </Box>
  );
}

function UserAvatar() {
  // Extract initials from email (first letter of local part and domain)
  const getInitials = (email: string) => {
    const [localPart, domain] = email.split('@');
    return `${localPart[0]?.toUpperCase()}${domain[0]?.toUpperCase()}` || 'SU';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar 
        alt={supplierEmail} 
        sx={{ 
          width: 40, 
          height: 40,
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        {getInitials(supplierEmail)}
      </Avatar>
      <Typography 
        variant="body1" 
        sx={{ 
          display: { xs: 'none', sm: 'block' },
          maxWidth: 200,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        {supplierEmail}
      </Typography>
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
    mode: 'light', // Force light mode
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
  return <AddProductPage/>;
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
          toolbarAccount: UserAvatar,
          appTitle: AppTitle,
        }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}