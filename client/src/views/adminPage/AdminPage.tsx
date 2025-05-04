import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  ListItemIcon,
  Toolbar,
  Typography,
  Container,
  Paper,
  Badge,
  Menu,
  MenuItem,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminSideBarComponent from "../../Components/AdminSideBarComponent";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

// Dashboard data
const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
  { month: "Jul", sales: 3490 },
];

const userTypeData = [
  { name: "New", value: 400 },
  { name: "Returning", value: 300 },
  { name: "Premium", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const recentOrders = [
  {
    id: "1",
    customer: "John Doe",
    product: "Product A",
    status: "Delivered",
    amount: "$120.00",
  },
  {
    id: "2",
    customer: "Jane Smith",
    product: "Product B",
    status: "Processing",
    amount: "$85.50",
  },
  {
    id: "3",
    customer: "Robert Johnson",
    product: "Product C",
    status: "Shipped",
    amount: "$210.75",
  },
];

const drawerWidth = 240;

interface AdminDashboardProps {
  window?: () => Window;
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("role");
    navigate("/"); // Redirect to home page
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 1,
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "#E5BA73",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" component={Link} to="/">
            <HomeIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Button onClick={handleLogout}>Logout</Button>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <AdminSideBarComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      ></Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.grey[100],
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* KPI Cards */}

          <Typography variant="h4"sx={{ flexGrow: 1 }} textAlign={"center"}>
            Welcome To Admin Dashboard
          </Typography>

          {/* Charts */}

          {/* Recent Orders */}
        </Container>
      </Box>
    </Box>
  );
}
