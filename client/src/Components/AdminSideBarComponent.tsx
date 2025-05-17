import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart2,
  Package,
  CheckSquare,
  Palette,
  CreditCard,
  MessageSquare,
} from "lucide-react";
const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard />, path: '/admin/dashboard' },
  { text: 'Customers', icon: <Users />, path: '/UserManagementDashboard' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/EventBookingsTable' },
  { text: 'Reports', icon: <BarChart2 />, path: '/admin/reports' },
  { text: 'Supplier Products', icon: <Package />, path: '/admin/supplierProducts' },
  { text: 'Supplier Accept Products', icon: <CheckSquare />, path: '/admin/supplierAcceptedProducts' },
  { text: 'Event Theme', icon: <Palette />, path: '/admin/EventTheme' },
  { text: 'Payment Details', icon: <CreditCard />, path: '/DataTable' },
  { text: 'Feedback Details', icon: <MessageSquare />, path: '/FeedbackList' },
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
