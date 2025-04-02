import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
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
  Cell
} from 'recharts';
import AdminSideBarComponent from '../../Components/AdminSideBarComponent';
import { useNavigate } from 'react-router-dom';

// Dashboard data
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
  { month: 'Jul', sales: 3490 },
];

const userTypeData = [
  { name: 'New', value: 400 },
  { name: 'Returning', value: 300 },
  { name: 'Premium', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const recentOrders = [
  { id: '1', customer: 'John Doe', product: 'Product A', status: 'Delivered', amount: '$120.00' },
  { id: '2', customer: 'Jane Smith', product: 'Product B', status: 'Processing', amount: '$85.50' },
  { id: '3', customer: 'Robert Johnson', product: 'Product C', status: 'Shipped', amount: '$210.75' },
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
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
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
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
      <AdminSideBarComponent mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.grey[100],
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* KPI Cards */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            sx={{ mb: 2 }}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#3f51b5',
                color: 'white',
                flexGrow: 1,
              }}
            >
              <Typography component="h2" variant="h6" gutterBottom>
                Total Sales
              </Typography>
              <Typography component="p" variant="h4">
                $24,550
              </Typography>
              <Typography sx={{ flex: 1 }} color="white" variant="body2">
                15% increase from last month
              </Typography>
            </Paper>
            
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#f50057',
                color: 'white',
                flexGrow: 1,
              }}
            >
              <Typography component="h2" variant="h6" gutterBottom>
                New Customers
              </Typography>
              <Typography component="p" variant="h4">
                324
              </Typography>
              <Typography sx={{ flex: 1 }} color="white" variant="body2">
                8% increase from last month
              </Typography>
            </Paper>
            
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#00bcd4',
                color: 'white',
                flexGrow: 1,
              }}
            >
              <Typography component="h2" variant="h6" gutterBottom>
                Pending Orders
              </Typography>
              <Typography component="p" variant="h4">
                47
              </Typography>
              <Typography sx={{ flex: 1 }} color="white" variant="body2">
                3% decrease from last month
              </Typography>
            </Paper>
          </Stack>
          
          {/* Charts */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            sx={{ mb: 2 }}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400,
                width: { xs: '100%', md: '66.6666%' },
              }}
            >
              <Typography component="h2" variant="h6" gutterBottom>
                Sales Overview
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
            
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 400,
                width: { xs: '100%', md: '33.3333%' },
              }}
            >
              <Typography component="h2" variant="h6" gutterBottom>
                User Types
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Stack>
          
          {/* Recent Orders */}
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Order ID</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Product</th>
                    <th style={{ textAlign: 'left', padding: '16px' }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '16px' }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: '16px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px' }}>{order.id}</td>
                      <td style={{ padding: '16px' }}>{order.customer}</td>
                      <td style={{ padding: '16px' }}>{order.product}</td>
                      <td style={{ padding: '16px' }}>
                        <Box
                          sx={{
                            bgcolor: 
                              order.status === 'Delivered' ? '#4caf50' : 
                              order.status === 'Shipped' ? '#2196f3' : '#ff9800',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                            color: 'white',
                          }}
                        >
                          {order.status}
                        </Box>
                      </td>
                      <td style={{ textAlign: 'right', padding: '16px' }}>{order.amount}</td>
                      <td style={{ textAlign: 'center', padding: '16px' }}>
                        <Button size="small" variant="outlined">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}