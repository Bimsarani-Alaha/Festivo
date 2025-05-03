import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import logo from '../../assets/logoremasted.png';
import AddProductPage from '../SupplierProducts/AddProductPage';

function AppTitle() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          height: 50,
          maxWidth: "auto",
        }}
      />
      <Typography variant="h6" noWrap>
        Supplier
      </Typography>
    </Box>
  );
}

const NAVIGATION: Navigation = [
  // {
  //   segment: 'dashboard',
  //   title: 'Dashboard',
  //   icon: <DashboardIcon />,
  // },
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

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
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

// === Page components ===

function DashboardPage() {
  return <Typography variant="h4">Welcome to the Dashboard</Typography>;
}

function OrdersPage() {
  return <Typography variant="h4">Here are your Orders</Typography>;
}

function ReportsPage() {
  return <Typography variant="h4">Reports Overview</Typography>;
}
function AddItemPage(){
  return <AddProductPage/>
}

function NotFoundPage() {
  return <Typography variant="h4">Here Your Products</Typography>;
}

// === Content switcher ===

function DemoPageContent({ pathname }: { pathname: string }) {
  let ContentComponent;

  switch (pathname) {
    // case '/dashboard':
    //   ContentComponent = DashboardPage;
    //   break;
    case '/orders':
      ContentComponent = OrdersPage;
      break;
    case '/add-items':
      ContentComponent=AddItemPage;
      break
    case '/reports':
      ContentComponent = ReportsPage;
      break;
    default:
      ContentComponent = NotFoundPage;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <ContentComponent />
    </Box>
  );
}

// === App Wrapper ===

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
          toolbarAccount: () => null,
          appTitle: AppTitle,
        }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
