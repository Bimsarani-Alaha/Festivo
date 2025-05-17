import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchAllSuplierProducts } from '../../api/supplierApi';
import supplierPaymentApi from '../../api/supplierPayment'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  alpha,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  InputAdornment
} from '@mui/material';
import { 
  ShoppingBag, 
  CurrencyRupee, 
  Inventory, 
  Person,
  ArrowForward,
  CheckCircle,
  Error,
  CalendarToday
} from '@mui/icons-material';
import { format, addDays } from 'date-fns';

interface SupplierProduct {
  id: string;
  supplierEmail: string;
  productName: string;
  price: number;
  quantity: string;
  description: string;
  imageUrl: string;
}

const AdminSupplierProducts: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentType, setPaymentType] = useState('CARD');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const { data: supplierData, isLoading, isError, refetch } = useQuery<SupplierProduct[]>({
    queryKey: ['product-data'],
    queryFn: fetchAllSuplierProducts,
  });

  const paymentMutation = useMutation({
    mutationFn: supplierPaymentApi.createSupplierPayment,
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Payment created successfully!',
        severity: 'success'
      });
      setOpenDialog(false);
      refetch();
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to create payment. Please try again.',
        severity: 'error'
      });
    }
  });

  const handleBuyNow = (product: SupplierProduct) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedProduct) return;

    const paymentData = {
      supplierEmail: selectedProduct.supplierEmail,
      productId: selectedProduct.id,
      orderRequestId: `ORD-${Date.now()}`,
      amount: selectedProduct.price,
      paymentType: paymentType,
      paymentStatus: 'PENDING',
      deliveryDate: addDays(new Date(), 3).toISOString(),
      paymentDate: new Date().toISOString()
    };

    paymentMutation.mutate(paymentData);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const isValidImage = (url: string) =>
    url.startsWith('http') || url.startsWith('https');

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress 
          thickness={4} 
          size={60} 
          sx={{ 
            color: '#C58940',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            }
          }} 
        />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%', 
            maxWidth: 600,
            borderRadius: 2,
            boxShadow: `0 6px 16px ${alpha('#C58940', 0.15)}`,
            '& .MuiAlert-icon': {
              color: '#FAF8F1'
            },
            backgroundColor: '#C58940'
          }}
        >
          Failed to fetch supplier products. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ backgroundColor: '#FAF8F1', minHeight: '100vh' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #C58940 0%, #E5BA73 100%)',
          color: '#FAF8F1',
          boxShadow: `0 6px 12px ${alpha('#C58940', 0.25)}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: alpha('#FAF8F1', 0.1)
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: alpha('#FAF8F1', 0.05)
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Admin Supplier Products
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.8 }}>
            {supplierData?.length || 0} products from your suppliers
          </Typography>
        </Box>
      </Paper>

      <Stack spacing={3}>
        {supplierData?.map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              display: 'flex',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: `1px solid ${alpha('#E5BA73', 0.2)}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 10px 20px ${alpha('#C58940', 0.15)}`,
                borderColor: alpha('#E5BA73', 0.5),
              }
            }}
          >
            {isValidImage(product.imageUrl) ? (
              <CardMedia
                component="img"
                sx={{ width: 200, height: '100%', objectFit: 'cover' }}
                image={product.imageUrl}
                alt={product.productName}
              />
            ) : (
              <Box 
                sx={{ 
                  width: 200, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha('#E5BA73', 0.1)
                }}
              >
                <ShoppingBag sx={{ fontSize: 80, color: '#C58940', opacity: 0.7 }} />
              </Box>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography 
                      variant="h5" 
                      fontWeight="600" 
                      gutterBottom
                      sx={{
                        color: '#C58940',
                        borderBottom: `2px solid ${alpha('#E5BA73', 0.4)}`,
                        display: 'inline-block',
                        pb: 0.5
                      }}
                    >
                      {product.productName}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`ID: ${product.id}`} 
                      sx={{ mb: 2, backgroundColor: alpha('#C58940', 0.1), color: '#C58940' }} 
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      backgroundColor: alpha('#E5BA73', 0.2),
                      color: '#C58940',
                      py: 0.5,
                      px: 2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: `inset 0 0 0 1px ${alpha('#C58940', 0.2)}`
                    }}
                  >
                    LKR {product.price}
                  </Typography>
                </Stack>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                
                <Box 
                  sx={{ 
                    backgroundColor: alpha('#FAEAB1', 0.3), 
                    borderRadius: 1.5, 
                    p: 1.5, 
                    mb: 2,
                    border: `1px solid ${alpha('#E5BA73', 0.2)}`
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Inventory sx={{ color: '#C58940' }} />
                      <Typography variant="body2">
                        <strong>Quantity:</strong> {product.quantity}
                      </Typography>
                    </Stack>
                    
                    {product.supplierEmail && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person sx={{ color: '#C58940' }} />
                        <Typography variant="body2">
                          <strong>Supplier:</strong> {product.supplierEmail}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => handleBuyNow(product)}
                  sx={{
                    backgroundColor: '#C58940',
                    color: '#FAF8F1',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#E5BA73',
                      boxShadow: `0 4px 8px ${alpha('#C58940', 0.3)}`
                    },
                    mt: 2
                  }}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Stack>
      
      {(!supplierData || supplierData.length === 0) && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: '#FAF8F1',
            border: `2px dashed ${alpha('#E5BA73', 0.4)}`,
            boxShadow: `inset 0 0 20px ${alpha('#E5BA73', 0.1)}`
          }}
        >
          <ShoppingBag sx={{ fontSize: 60, color: '#C58940', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No supplier products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Products added by suppliers will appear here
          </Typography>
        </Paper>
      )}

      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#FAF8F1', color: '#C58940' }}>
          Confirm Purchase
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#FAF8F1', pt: 3 }}>
          {selectedProduct && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ color: '#C58940' }}>
                {selectedProduct.productName}
              </Typography>
              
              <TextField
                label="Supplier Email"
                value={selectedProduct.supplierEmail}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#C58940' }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              
              <TextField
                label="Product ID"
                value={selectedProduct.id}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
              
              <TextField
                label="Amount (LKR)"
                value={selectedProduct.price}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupee sx={{ color: '#C58940' }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              
              <TextField
                select
                label="Payment Type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                fullWidth
              >
                <MenuItem value="CARD">Credit/Debit Card</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="CASH">Cash on Delivery</MenuItem>
              </TextField>
              
              <TextField
                label="Payment Date"
                value={format(new Date(), 'yyyy-MM-dd')}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: '#C58940' }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              
              <TextField
                label="Estimated Delivery Date"
                value={format(addDays(new Date(), 3), 'yyyy-MM-dd')}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: '#C58940' }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#FAF8F1', p: 3 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#C58940' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePaymentSubmit}
            disabled={paymentMutation.isPending}
            startIcon={paymentMutation.isPending ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              backgroundColor: '#C58940',
              color: '#FAF8F1',
              '&:hover': {
                backgroundColor: '#E5BA73',
              },
              '&:disabled': {
                backgroundColor: alpha('#C58940', 0.5),
              }
            }}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={snackbar.severity === 'success' ? <CheckCircle /> : <Error />}
          sx={{
            backgroundColor: snackbar.severity === 'success' ? '#4CAF50' : '#F44336'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSupplierProducts;
