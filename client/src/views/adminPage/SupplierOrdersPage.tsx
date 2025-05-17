import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { SupplierOrder } from '../../api/supplierOrder'; // Adjust the import path as needed

const SupplierOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const res = await axios.get("/public/supplierOrder/get-accepted");
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch accepted orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedOrders();
  }, []);

  const handlePayOrder = (order: SupplierOrder) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const confirmPayment = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      // Replace with your actual payment API endpoint
      await axios.post(`/public/supplierOrder/pay/${selectedOrder.id}`);
      
      // Update the local state to reflect the payment
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, isPaid: true } : order
      ));
      
      setSuccessMessage(`Order #${selectedOrder.id} has been paid successfully`);
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to process payment');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  if (loading && orders.length === 0) {
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Accepted Supplier Orders
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Typography color="success.main">Paid</Typography>
                  ) : (
                    <Typography color="warning.main">Pending Payment</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {!order.isPaid && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePayOrder(order)}
                      disabled={loading}
                    >
                      Pay
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark Order #{selectedOrder?.id} as paid? 
            This will process a payment of ${selectedOrder?.totalAmount.toFixed(2)} 
            to {selectedOrder?.supplierName}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={confirmPayment} 
            color="primary" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierOrdersPage;