import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import logo from '../../assets/logoremasted.png';
import AddProductPage from '../SupplierProducts/AddProductPage';
import SupplierOrders from './SupplierOrderPage';
import ProfileMenu from '../../Components/views/Supplier/ProfileMenu';
import {
  PackageCheck,
  PlusCircle,
  CreditCard,
} from 'lucide-react';
import SupplierPaymentManagement from './SupplierPaymentManagement';



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
    icon: <PackageCheck />
  },
  {
    segment: 'add-items',
    title: 'Add Items',
    icon: <PlusCircle />
  },
  {
    segment: 'payment',
    title: 'Payment',
    icon: <CreditCard />
  }
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

function PaymentPage() {
  return <SupplierPaymentManagement />;
}

function AddItemPage() {
  return <AddProductPage />;
}

function NotFoundPage() {
  return <Typography variant="h4">Page Not Found</Typography>;
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
    case '/payment':
      ContentComponent = PaymentPage;
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

