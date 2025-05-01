import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon, ShoppingCart as ShoppingCartIcon, BarChart as BarChartIcon, Settings as SettingsIcon } from '@mui/icons-material';
import ContrastIcon from '@mui/icons-material/Contrast';
const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/UserManagementDashboard' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/EventBookingsTable' },
  { text: 'Reports', icon: <BarChartIcon />, path: '/admin/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  { text: 'Event Theme', icon: <ContrastIcon />, path: '/admin/EventTheme' },
  { text: 'Payment Details', icon: <BarChartIcon />, path: '/DataTable' },
];

interface AdminSideBarProps {
  window?: () => Window;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const AdminSideBarComponent: React.FC<AdminSideBarProps> = ({ window, mobileOpen, handleDrawerToggle }) => {
  const container = window !== undefined ? () => window().document.body : undefined;

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          ADMIN PANEL
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSideBarComponent;
