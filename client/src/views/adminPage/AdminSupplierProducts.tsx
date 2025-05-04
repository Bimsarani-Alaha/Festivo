import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllSuplierProducts } from '../../api/supplierApi';
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
} from '@mui/material';
import { 
  ShoppingBag, 
  CurrencyRupee, 
  Inventory, 
  Person,
  ArrowForward
} from '@mui/icons-material';

const AdminSupplierProducts: React.FC = () => {
  const { data: supplierData, isLoading, isError } = useQuery({
    queryKey: ['product-data'],
    queryFn: fetchAllSuplierProducts,
  });

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

  const isValidImage = (url: string) =>
    url.startsWith('http') || url.startsWith('https');

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
        {supplierData?.map((product: any) => (
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
                        <strong>Quantity:</strong> {product.quantity} units
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
    </Box>
  );
};

export default AdminSupplierProducts;