import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  SelectChangeEvent,
  Tabs,
  Tab
} from '@mui/material';
import supplierPaymentApi, { SupplierPayment, SupplierPaymentRequest } from '../../api/supplierPayment';
import { getSupplierDetails } from "../../customHooks/supplierEmailextract";

const SupplierPaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState<SupplierPayment | null>(null);
  const [editForm, setEditForm] = useState<SupplierPaymentRequest>({
    supplierEmail: '',
    productId: '',
    orderRequestId: '',
    amount: 0,
    paymentType: 'BANK_TRANSFER',
    paymentStatus: 'PENDING',
    deliveryDate: new Date().toISOString().split('T')[0],
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  // Get supplier email from token
    const supplierDetails = getSupplierDetails();
    const supplierEmail =  supplierDetails?.email || "Error Loading";

  // Status options for dropdown
  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  // Payment type options
  const paymentTypeOptions = [
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' }
  ];

  // Fetch all payments on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await supplierPaymentApi.getAllSupplierPayments();
        // Filter payments to only show those belonging to the current supplier
        const filteredData = data.filter(payment => payment.supplierEmail === supplierEmail);
        setPayments(filteredData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch payments. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [supplierEmail]);

  // Filter payments by type
  const orderPayments = payments.filter(p => p.orderRequestId);
  const productPayments = payments.filter(p => p.productId);

  // Handle opening edit dialog
  const handleEditClick = (payment: SupplierPayment) => {
    setCurrentPayment(payment);
    setEditForm({
      supplierEmail: payment.supplierEmail,
      productId: payment.productId,
      orderRequestId: payment.orderRequestId,
      amount: payment.amount,
      paymentType: payment.paymentType,
      paymentStatus: payment.paymentStatus,
      deliveryDate: payment.deliveryDate.toString().split('T')[0],
      paymentDate: payment.paymentDate.toString().split('T')[0]
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentPayment) return;

    try {
      setLoading(true);
      
      // Prepare the update data - supplier can only update specific fields
      const updateData: SupplierPaymentRequest = {
        supplierEmail: editForm.supplierEmail,
        paymentStatus: editForm.paymentStatus,
        deliveryDate: editForm.deliveryDate,
        // Include these fields but they won't be editable
        productId: currentPayment.productId,
        orderRequestId: currentPayment.orderRequestId,
        amount: currentPayment.amount,
        paymentType: currentPayment.paymentType,
        paymentDate: currentPayment.paymentDate.toString().split('T')[0]
      };

      const updatedPayment = await supplierPaymentApi.updateSupplierPayment(
        currentPayment.id!,
        updateData
      );

      // Update the payments list with the updated payment
      setPayments(prev =>
        prev.map(p => (p.id === currentPayment.id ? updatedPayment : p))
      );

      setOpenEditDialog(false);
      setError(null);
    } catch (err) {
      setError('Failed to update payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: 'orders' | 'products') => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Payment Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Order Payments" value="orders" />
        <Tab label="Product Payments" value="products" />
      </Tabs>

      {loading && payments.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier Email</TableCell>
                {activeTab === 'orders' ? (
                  <TableCell>Order Request ID</TableCell>
                ) : (
                  <TableCell>Product ID</TableCell>
                )}
                <TableCell>Amount</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Payment Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeTab === 'orders' ? orderPayments : productPayments).map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.supplierEmail}</TableCell>
                  {activeTab === 'orders' ? (
                    <TableCell>{payment.orderRequestId}</TableCell>
                  ) : (
                    <TableCell>{payment.productId}</TableCell>
                  )}
                  <TableCell>LKR{" "} {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell>{payment.paymentStatus}</TableCell>
                  <TableCell>{formatDate(payment.deliveryDate)}</TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Supplier Email"
              name="supplierEmail"
              value={editForm.supplierEmail}
              onChange={handleInputChange}
            />
            
            {activeTab === 'orders' ? (
              <TextField
                margin="normal"
                fullWidth
                label="Order Request ID"
                name="orderRequestId"
                value={editForm.orderRequestId}
                disabled
              />
            ) : (
              <TextField
                margin="normal"
                fullWidth
                label="Product ID"
                name="productId"
                value={editForm.productId}
                disabled
              />
            )}
            
            <TextField
              margin="normal"
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={editForm.amount}
              disabled
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Type</InputLabel>
              <Select
                name="paymentType"
                value={editForm.paymentType}
                label="Payment Type"
                disabled
              >
                {paymentTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={editForm.paymentStatus}
                label="Payment Status"
                onChange={handleSelectChange}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              label="Delivery Date"
              name="deliveryDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editForm.deliveryDate}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Payment Date"
              name="paymentDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editForm.paymentDate}
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierPaymentManagement;