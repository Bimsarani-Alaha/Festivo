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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { createProduct, getProduct, updateProduct, deleteProduct } from '../../api/supplierProduct';
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
  const supplierDetails = getSupplierDetails();
  const supplierEmail = supplierDetails?.email;

  const [formData, setFormData] = useState<ProductFormData>({
    supplierEmail: supplierEmail || '',
    productName: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const resetForm = () => {
    setFormData({
      supplierEmail: supplierEmail || '',
      productName: '',
      price: '',
      quantity: '',
      description: '',
      imageUrl: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (!formData.productName || !formData.price || !formData.quantity) {
        throw new Error('Please fill in all required fields');
      }
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price).toFixed(2)
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData); // Now passing both id and data
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(productData);
        setSuccess('Product added successfully!');
      }
      
      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      supplierEmail: supplierEmail || '',
      productName: product.productName,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description,
      imageUrl: product.imageUrl
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCancel = () => {
    resetForm();
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setDeleting(true);
    setError('');
    
    try {
      await deleteProduct(productToDelete);
      setSuccess('Product deleted successfully!');
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={4}>
        {/* Add/Edit Product Form */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
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
                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
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
              
              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ py: 2, flexGrow: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </Button>
                
                {editingProduct && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={handleUpdateCancel}
                    sx={{ py: 2, flexGrow: 1 }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
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
                        <IconButton color="primary" onClick={() => handleEdit(product)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(product.id)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddProductPage;