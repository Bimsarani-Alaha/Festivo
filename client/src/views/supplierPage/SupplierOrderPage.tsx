import React, { useEffect, useState } from 'react';
import { 
  getAllSupplierOrders, 
  SupplierOrder 
} from '../../api/supplierOrder';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<'Accept' | 'Reject'>('Accept');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllSupplierOrders();
        const normalizedData = data.map(order => ({
          ...order,
          status: order.status || 'Pending'
        }));
        setOrders(normalizedData);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
        showSnackbar('Failed to fetch orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: 'Accept' | 'Reject') => {
    try {
      const response = await axios.put(
        `http://localhost:8080/public/supplierOrder/status/${orderId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleActionClick = (order: SupplierOrder, action: 'Accept' | 'Reject') => {
    setSelectedOrder(order);
    setSelectedAction(action);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrder) return;
    
    try {
      setActionLoading(true);
      const updatedOrder = await updateOrderStatus(selectedOrder.id, selectedAction);

      const updatedOrders = orders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      );
      
      setOrders(updatedOrders);
      setActionDialogOpen(false);
      showSnackbar(`Order ${selectedAction === 'Accept' ? 'accepted' : 'rejected'} successfully`, 'success');
    } catch (err) {
      console.error('Failed to update order status:', err);
      showSnackbar(`Failed to ${selectedAction.toLowerCase()} order`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => 
        order.status?.toLowerCase() === statusFilter.toLowerCase()
      );

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'default';
    
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'pending':
        return 'primary';
      case 'accept':
        return 'success';
      case 'reject':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Supplier Orders</Typography>
        
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accept">Accepted</MenuItem>
            <MenuItem value="reject">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="supplier orders table">
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Theme</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.eventName}</TableCell>
                  <TableCell>{order.eventType}</TableCell>
                  <TableCell>{order.eventPackage}</TableCell>
                  <TableCell>{order.eventTheme}</TableCell>
                  <TableCell>
                    {format(new Date(order.eventDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{order.noOfGuest}</TableCell>
                  <TableCell>{order.supplierCategory}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status || 'Unknown'} 
                      color={getStatusColor(order.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {order.status?.toLowerCase() === 'pending' && (
                      <Box display="flex" gap={1}>
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          onClick={() => handleActionClick(order, 'Accept')}
                          disabled={actionLoading}
                          startIcon={
                            actionLoading && 
                            selectedOrder?.id === order.id && 
                            selectedAction === 'Accept' ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : null
                          }
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          onClick={() => handleActionClick(order, 'Reject')}
                          disabled={actionLoading}
                          startIcon={
                            actionLoading && 
                            selectedOrder?.id === order.id && 
                            selectedAction === 'Reject' ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : null
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={actionDialogOpen}
        onClose={() => !actionLoading && setActionDialogOpen(false)}
      >
        <DialogTitle>
          Confirm {selectedAction === 'Accept' ? 'Acceptance' : 'Rejection'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedAction.toLowerCase()} this order for {selectedOrder?.eventName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setActionDialogOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction}
            color={selectedAction === 'Accept' ? 'success' : 'error'}
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {selectedAction}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default OrderManagement;