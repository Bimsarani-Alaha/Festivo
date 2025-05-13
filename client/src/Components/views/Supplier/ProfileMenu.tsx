import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  Paper,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import {
  Person,
  Settings,
  Logout,
  Edit,
  Delete,
  ArrowBack,
  Business,
  LocationOn,
  Email,
  Category,
  Check,
} from "@mui/icons-material";
import {
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../api/supplierApi";
import { useNavigate } from "react-router-dom";
import { getSupplierDetails } from "../../../customHooks/supplierEmailextract";

const categories = [
  "Decoration And Balloon",
  "Photography",
  "Furniture And Seating",
  "Floral Decoration",
];

interface SupplierData {
  id: string;
  supplierEmail: string;
  companyName: string;
  category: string;
  address: string;
}

const ProfileMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supplierDetails = getSupplierDetails();
  const supplierEmail = supplierDetails?.email || "Error Loading";

  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    category: "",
    address: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Replace with actual logged-in user email
  const userEmail = supplierEmail;

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (openDialog) {
      fetchSupplierData();
    }
  }, [openDialog]);

  const fetchSupplierData = async () => {
    setIsLoading(true);
    try {
      const data = await getSupplier(userEmail);
      setSupplierData(data);
      setFormData({
        companyName: data.companyName,
        category: data.category,
        address: data.address,
      });
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      showSnackbar("Failed to fetch supplier data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedData = await updateSupplier(userEmail, formData);
      setSupplierData(updatedData);
      setEditMode(false);
      showSnackbar("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating supplier:", error);
      showSnackbar("Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteSupplier(userEmail);
      showSnackbar("Account deleted successfully", "success");
      setOpenDeleteDialog(false);
      // Redirect to login page after deletion
      navigate("/supplierLogin");
    } catch (error) {
      console.error("Error deleting account:", error);
      showSnackbar("Failed to delete account", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    // You might also want to clear session storage if you're using it
    sessionStorage.clear();

    // Redirect to login page
    navigate("/supplierLogin");
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ml: 2,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: theme.palette.primary.main,
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {userEmail.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))",
            mt: 1.5,
            borderRadius: 2,
            minWidth: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box px={2} py={1.5}>
          <Typography variant="subtitle1" fontWeight="bold">
            {userEmail}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supplier Account
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Person fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography>Profile</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: "error.main", py: 1.5 }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <Delete fontSize="small" />
          </ListItemIcon>
          <Typography>Delete Account</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Logout fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Profile Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2, overflow: "hidden" },
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            p: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={handleDialogClose}
                sx={{ color: "#fff", mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Supplier Profile
              </Typography>
            </Box>
            {!editMode && (
              <Button
                startIcon={<Edit />}
                onClick={handleEditClick}
                variant="outlined"
                size="small"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": {
                    backgroundColor: alpha("#fff", 0.1),
                    borderColor: "#fff",
                  },
                }}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          {isLoading && !supplierData ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: theme.palette.primary.main,
                      fontSize: "2rem",
                      fontWeight: "bold",
                      mr: 2,
                    }}
                  >
                    {supplierData?.companyName?.charAt(0).toUpperCase() || "S"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {supplierData?.companyName || "Company Name"}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Email fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {supplierData?.supplierEmail}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Category fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {supplierData?.category || "No category set"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="flex-start">
                  <LocationOn
                    fontSize="small"
                    color="action"
                    sx={{ mr: 1, mt: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {supplierData?.address || "No address set"}
                  </Typography>
                </Box>
              </Paper>

              {editMode && (
                <Box component="form" sx={{ mt: 3 }}>
                  <Box mb={3} display="flex" alignItems="center">
                    <Business color="primary" sx={{ mr: 1 }} />
                    <TextField
                      name="companyName"
                      label="Company Name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Box>

                  <Box mb={3} display="flex" alignItems="center">
                    <Category color="primary" sx={{ mr: 1 }} />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={handleCategoryChange}
                        label="Category"
                        native
                      >
                        <option value=""></option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box mb={3} display="flex" alignItems="flex-start">
                    <LocationOn color="primary" sx={{ mr: 1, mt: 2 }} />
                    <TextField
                      name="address"
                      label="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        {editMode && (
          <DialogActions sx={{ p: 2, px: 3 }}>
            <Button
              onClick={handleDialogClose}
              color="inherit"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Check />}
              sx={{
                px: 3,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          elevation: 5,
          sx: { borderRadius: 2, overflow: "hidden" },
        }}
      >
        <Box sx={{ backgroundColor: "#f44336", color: "#fff", p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Delete Account
          </Typography>
        </Box>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha("#f44336", 0.1),
                color: "#f44336",
                mb: 2,
              }}
            >
              <Delete fontSize="large" />
            </Avatar>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              textAlign="center"
            >
              Are you sure you want to delete your account?
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            gutterBottom
          >
            This action cannot be undone. All your data will be permanently
            removed from our servers.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            You will lose all your supplier details, listings, and customer
            relationships.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3, justifyContent: "space-between" }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="inherit"
            variant="outlined"
            sx={{ width: "48%" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Delete />}
            sx={{ width: "48%" }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileMenu;
