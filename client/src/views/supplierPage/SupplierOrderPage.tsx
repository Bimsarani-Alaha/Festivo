import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { getAllSupplierOrders, acceptSupplierOrder, rejectSupplierOrder, SupplierOrder } from '../../api/supplierOrder';
import { getSupplier } from '../../api/supplierApi';
import { getSupplierDetails } from '../../customHooks/supplierEmailextract';

const SupplierOrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supplierDetails = getSupplierDetails();
  const sEmail = supplierDetails?.email || "Error Loading";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [supplierCategory, setSupplierCategory] = useState<string | null>(null);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const supplierEmail = sEmail;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supplierData = await getSupplier(supplierEmail);
        setSupplierCategory(supplierData.category);

        const data = await getAllSupplierOrders();
        setOrders(data);

        if (supplierData.category) {
          const filtered = data.filter(order => order.supplierCategory === supplierData.category);
          setFilteredOrders(filtered);
        }

        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptClick = (orderId: string) => {
    setSelectedOrder(orderId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setAmount('');
  };

  const handleConfirmAccept = async () => {
    if (!selectedOrder || !amount) return;
    
    try {
      setLoading(true);
      await acceptSupplierOrder(selectedOrder, supplierEmail, amount);
      const data = await getAllSupplierOrders();
      setOrders(data);
      
      if (supplierCategory) {
        setFilteredOrders(data.filter(order => order.supplierCategory === supplierCategory));
      }
      
      setSuccess('Order accepted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to accept order. Please try again.');
      console.error('Error accepting order:', err);
    } finally {
      setLoading(false);
      handleDialogClose();
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      setLoading(true);
      await rejectSupplierOrder(orderId);
      const data = await getAllSupplierOrders();
      setOrders(data);
      
      if (supplierCategory) {
        setFilteredOrders(data.filter(order => order.supplierCategory === supplierCategory));
      }
      
      setSuccess('Order rejected successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to reject order. Please try again.');
      console.error('Error rejecting order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'accept':
        return 'success';
      case 'rejected':
      case 'reject':
        return 'error';
      default:
        return 'warning';
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOrderAccepted = (status: string) => {
    return status.toLowerCase() === 'accepted' || status.toLowerCase() === 'accept';
  };

  const isOrderRejected = (status: string) => {
    return status.toLowerCase() === 'rejected' || status.toLowerCase() === 'reject';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Orders Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Theme</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No orders found for your category
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const accepted = isOrderAccepted(order.status);
                    const rejected = isOrderRejected(order.status);

                    return (
                      <TableRow key={order.id}>
                        <TableCell>{order.eventName}</TableCell>
                        <TableCell>{order.eventPackage}</TableCell>
                        <TableCell>{order.eventTheme}</TableCell>
                        <TableCell>{order.eventType}</TableCell>
                        <TableCell>{order.noOfGuest}</TableCell>
                        <TableCell>{formatDate(order.eventDate)}</TableCell>
                        <TableCell>{order.supplierCategory}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleAcceptClick(order.id)}
                              disabled={accepted || rejected}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleReject(order.id)}
                              disabled={rejected || accepted}
                            >
                              Reject
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Amount Input Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Enter Amount for Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAccept} 
            color="success"
            disabled={!amount}
          >
            Confirm Acceptance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierOrdersDashboard;