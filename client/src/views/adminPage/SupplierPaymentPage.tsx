import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface SupplierOrder {
  id: string;
  eventName: string;
  eventPackage: string;
  eventTheme: string;
  eventType: string;
  noOfGuest: number;
  specialRequest: string;
  eventDate: Date | string;
  eventId: string | null;
  supplierCategory: string;
  status: 'ACCEPTED' | 'REJECTED' | 'ONGOING' | 'accept' | 'reject'| 'PAID';
  amount: string; // Kept as string to match API response
  supplierEmail?: string;
}

interface SupplierPaymentRequest {
  supplierEmail: string;
  eventId: string;
  orderRequestId: string;
  amount: string; // Kept as string to match API requirements
  paymentType: string;
  paymentStatus: string;
  eventDate: string;
  paymentDate: string;
}

const SupplierPaymentPage: React.FC = () => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [paymentData, setPaymentData] = useState<SupplierPaymentRequest>({
    supplierEmail: '',
    eventId: '',
    orderRequestId: '',
    amount: '',
    paymentType: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    eventDate: '',
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const res = await axios.get("/public/supplierOrder/get-accepted");
        // Map the response to ensure all orders have required fields
        const validatedOrders = res.data.map((order: any) => ({
          id: order.id || '',
          eventName: order.eventName || 'Unnamed Event',
          eventPackage: order.eventPackage || '',
          eventTheme: order.eventTheme || '',
          eventType: order.eventType || '',
          noOfGuest: order.noOfGuest || 0,
          specialRequest: order.specialRequest || '',
          eventDate: order.eventDate || new Date().toISOString(),
          eventId: order.eventId || null,
          supplierCategory: order.supplierCategory || '',
          status: order.status || 'ONGOING',
          amount: order.amount || '0', // Keep as string
          supplierEmail: order.acceptedSupplier || '', // Using acceptedSupplier field from the response
        }));
        setOrders(validatedOrders.filter((order: SupplierOrder) => 
          ['ACCEPTED', 'accept'].includes(order.status)
        ));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch accepted orders');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };

    fetchAcceptedOrders();
  }, []);

  const handlePaymentInit = (order: SupplierOrder) => {
    setSelectedOrder(order);
    setPaymentData({
      supplierEmail: order.supplierEmail || '',
      eventId: order.eventId || '',
      orderRequestId: order.id,
      amount: order.amount || '0',
      paymentType: 'BANK_TRANSFER',
      paymentStatus: 'PAID',
      eventDate: typeof order.eventDate === 'string' 
        ? order.eventDate 
        : format(order.eventDate, 'yyyy-MM-dd'),
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setOpenDialog(true);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async () => {
    try {
      setPaymentError(null);
      
      const payload = {
        ...paymentData,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'PAID',
      };
      
      const response = await axios.post("public/supplier/supplier-payment/create", payload);
      
      // Update order status to PAID
      if (selectedOrder) {
        
        // Refresh orders list
        const res = await axios.get("/public/supplierOrder/get-accepted");
        const validatedOrders = res.data.map((order: any) => ({
          ...order,
          amount: order.amount || '0',
          supplierEmail: order.acceptedSupplier || '',
        }));
        setOrders(validatedOrders.filter((order: SupplierOrder) => 
          ['ACCEPTED', 'accept'].includes(order.status)
        ));
      }
      
      setPaymentSuccess(true);
      setTimeout(() => {
        setOpenDialog(false);
        setPaymentSuccess(false);
      }, 1500);
    } catch (err) {
      setPaymentError('Failed to create payment. Please try again.');
      console.error('Error creating payment:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Supplier Payments
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Accepted Supplier Orders
            </Typography>
            {orders.length === 0 ? (
              <Alert severity="info">No accepted orders found</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Name</TableCell>
                      <TableCell>Package</TableCell>
                      <TableCell>Event Type</TableCell>
                      <TableCell>Guests</TableCell>
                      <TableCell>Event Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.eventName}</TableCell>
                        <TableCell>{order.eventPackage}</TableCell>
                        <TableCell>{order.eventType}</TableCell>
                        <TableCell>{order.noOfGuest}</TableCell>
                        <TableCell>
                          {new Date(order.eventDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>Rs{order.amount}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          {order.status !== 'PAID' ? (
                            <Button 
                              variant="contained" 
                              color="primary"
                              onClick={() => handlePaymentInit(order)}
                            >
                              Create Payment
                            </Button>
                          ) : (
                            <Typography color="success.main">Paid</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Supplier Payment</DialogTitle>
          <DialogContent>
            {paymentSuccess ? (
              <Alert severity="success">Payment created successfully!</Alert>
            ) : (
              <Box component="form" sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    value={selectedOrder?.eventName || ''}
                    margin="normal"
                    disabled
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      label="Supplier Email"
                      value={paymentData.supplierEmail}
                      margin="normal"
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="Event ID"
                      value={paymentData.eventId}
                      margin="normal"
                      disabled
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      label="Order Request ID"
                      value={paymentData.orderRequestId}
                      margin="normal"
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="Amount"
                      value={paymentData.amount}
                      margin="normal"
                      InputProps={{
                        startAdornment: 'LKR',
                      }}
                      disabled
                    />
                  </Stack>
                  <TextField
                    select
                    fullWidth
                    label="Payment Type"
                    name="paymentType"
                    value={paymentData.paymentType}
                    onChange={handlePaymentChange}
                    margin="normal"
                  >
                    <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                    <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                    <MenuItem value="PAYPAL">PayPal</MenuItem>
                    <MenuItem value="CASH">Cash</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Event Date"
                    value={new Date(paymentData.eventDate).toLocaleDateString()}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Payment Date"
                    value={new Date().toLocaleString()}
                    margin="normal"
                    disabled
                  />
                </Stack>
                {paymentError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {paymentError}
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {!paymentSuccess && (
              <>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button 
                  onClick={handlePaymentSubmit} 
                  variant="contained" 
                  color="primary"
                >
                  Confirm Payment
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default SupplierPaymentPage;