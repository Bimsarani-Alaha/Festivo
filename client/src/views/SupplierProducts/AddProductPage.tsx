import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { createProduct, getProduct } from '../../api/supplierProduct';
import { Delete, Edit } from '@mui/icons-material';
import { getSupplierDetails } from '../../customHooks/supplierEmailextract';

interface ProductFormData {
  supplierEmail: string;
  productName: string;
  price: string;
  quantity: string;
  description: string;
  imageUrl: string;
}

interface Product {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

const AddProductPage: React.FC = () => {
  const supplierDetails = getSupplierDetails()
  const supplierEmail = supplierDetails?.email;

  const [formData, setFormData] = useState<ProductFormData>({
    supplierEmail: supplierEmail || '',
    productName: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!supplierEmail) {
      setError('Supplier email is not available');
      return;
    }
    fetchProducts();
  }, [supplierEmail]);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      setError('');
      
      if (!supplierEmail) {
        throw new Error('Supplier email is required');
      }
      
      const data = await getProduct(supplierEmail);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setFetching(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      if (!formData.productName || !formData.price || !formData.quantity) {
        throw new Error('Please fill in all required fields');
      }
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price).toFixed(2)
      };
      
      await createProduct(productData);
      setSuccess(true);
      // Reset form and refresh product list
      setFormData({
        supplierEmail: formData.supplierEmail,
        productName: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: ''
      });
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={4}>
        {/* Add Product Form */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Add New Product
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Product added successfully!
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Supplier Email"
                name="supplierEmail"
                type="email"
                value={formData.supplierEmail}
                onChange={handleChange}
                variant="outlined"
                disabled
              />
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  variant="outlined"
                />
                
                <TextField
                  required
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{
                    min: "1"
                  }}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{
                    step: "0.01",
                    min: "0"
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                />
              </Stack>
              
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Add Product'
                )}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Product Preview */}
        {formData.productName && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Product Preview
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {formData.imageUrl && (
                <Box sx={{ width: { xs: '100%', sm: '40%' } }}>
                  <Box
                    component="img"
                    src={formData.imageUrl}
                    alt="Product preview"
                    sx={{ width: '100%', borderRadius: 1 }}
                  />
                </Box>
              )}
              <Box sx={{ width: { xs: '100%', sm: formData.imageUrl ? '60%' : '100%' } }}>
                <Typography variant="h5">{formData.productName}</Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  ${formData.price || '0.00'}
                </Typography>
                <Typography variant="body1" paragraph>
                  {formData.description || 'No description provided'}
                </Typography>
                <Typography variant="body2">
                  <strong>Quantity:</strong> {formData.quantity || 'Not specified'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Supplier Products List */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Products
          </Typography>
          {fetching ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No products found. Add your first product above.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {product.imageUrl && (
                            <Box
                              component="img"
                              src={product.imageUrl}
                              alt={product.productName}
                              sx={{ width: 50, height: 50, objectFit: 'cover' }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">{product.productName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.description.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default AddProductPage;