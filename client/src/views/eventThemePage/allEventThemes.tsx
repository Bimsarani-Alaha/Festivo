import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EventThemeSchema,
  updateEventTheme,
  deleteEventTheme,
} from "../../api/eventThemeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ThemeProvider,
  createTheme,
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fade,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  AttachMoney as AttachMoneyIcon,
  ColorLens as ColorLensIcon,
  Category as CategoryIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

// Custom theme based on the color palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#C58940",
      light: "#E5BA73",
      dark: "#A67535",
      contrastText: "#FAF8F1",
    },
    secondary: {
      main: "#E5BA73",
      light: "#FAEAB1",
      dark: "#C58940",
      contrastText: "#433520",
    },
    background: {
      default: "#FAF8F1",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#433520",
      secondary: "#705B35",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#fff",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#fff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#C58940",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#C58940",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5BA73",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        contained: {
          boxShadow: "0 4px 12px rgba(197, 137, 64, 0.2)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(197, 137, 64, 0.3)",
          },
        },
        outlined: {
          borderColor: "#E5BA73",
          color: "#C58940",
          "&:hover": {
            borderColor: "#C58940",
            backgroundColor: "rgba(197, 137, 64, 0.04)",
          },
        },
        text: {
          color: "#C58940",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: "#FAEAB1",
          color: "#705B35",
          "&:hover": {
            backgroundColor: "#E5BA73",
          },
        },
        outlined: {
          borderColor: "#E5BA73",
          color: "#C58940",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(197, 137, 64, 0.2)",
          },
        },
      },
    },
  },
});

const AllEventThemes: React.FC = () => {
  const [themes, setThemes] = useState<EventThemeSchema[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<EventThemeSchema[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EventThemeSchema>>({});
  const [filter, setFilter] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteSnackbar, setDeleteSnackbar] = useState(false);
  const [openFailedSnackbar, setOpenFailedSnackbar] = useState(false);

  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    themeName: string;
  } | null>(null);

  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const queryClient = useQueryClient();

  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredThemes(themes.filter((theme) => theme.eventName === filter));
    } else {
      setFilteredThemes(themes);
    }
  }, [filter, themes]);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const response = await axios.get<EventThemeSchema[]>(
        "/public/event-theme"
      );
      setThemes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch event themes", error);
      setLoading(false);
    }
  };

  const handleEdit = (theme: EventThemeSchema) => {
    setEditingId(theme.id);
    setEditData(theme);
  };

  const { mutate: updateEventThemeMutation } = useMutation({
    mutationFn: updateEventTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EventTheme"] });
      fetchThemes();
      setEditingId(null);
      setEditData({});
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.error("Failed to update event theme", error);
    },
  });

  const { mutate: deleteEventThemeMutation } = useMutation({
    mutationFn: deleteEventTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EventTheme"] });
      fetchThemes();
      setDeleteSnackbar(true);
    },
    onError: (error) => {
      console.error("Failed to delete event theme", error);
      setOpenFailedSnackbar(true);
    },
  });

  const handleSave = () => {
    if (!editingId) return;

    const updatedTheme: EventThemeSchema = {
      id: editingId,
      eventName: editData.eventName || "",
      themeName: editData.themeName || "",
      color: editData.color || "",
      price: editData.price ?? 0,
      description: editData.description ?? "",
      img: editData.img || "",
    };

    updateEventThemeMutation(updatedTheme);
  };

  const handleDelete = (themeId: string, themeName: string) => {
    setConfirmDelete(null);
    deleteEventThemeMutation({ themeId, themeName });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleFilterChange = (eventName: string | null) => {
    setFilter(eventName);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDeleteSnackbar = () => {
    setDeleteSnackbar(false);
    setOpenFailedSnackbar(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const eventTypes = ["Birthday", "Proposal", "Gender Reveal"];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#FAF8F1", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Card
            elevation={4}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(197, 137, 64, 0.15)",
            }}
          >
            <Box
              sx={{
                bgcolor: "#FAEAB1",
                py: 2,
                px: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  gutterBottom
                  fontWeight={600}
                  color="#433520"
                >
                  Event Themes Gallery
                </Typography>
                <Typography
                  variant="body1"
                  color="#705B35"
                  sx={{ opacity: 0.9 }}
                >
                  Browse, edit or delete your event themes
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/admin/EventTheme"
                variant="contained"
                sx={{ bgcolor: "#C58940", "&:hover": { bgcolor: "#A67535" } }}
              >
                Create New Theme
              </Button>
            </Box>
          </Card>

          {/* Filter Section */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon sx={{ color: "#C58940" }} />
              <Typography variant="subtitle1" fontWeight={500} color="#433520">
                Filter by event type:
              </Typography>
            </Box>

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={1}
              sx={{ flexGrow: 1, flexWrap: "wrap" }}
            >
              {eventTypes.map((eventType) => (
                <Button
                  key={eventType}
                  variant={filter === eventType ? "contained" : "outlined"}
                  onClick={() => handleFilterChange(eventType)}
                  sx={{
                    bgcolor: filter === eventType ? "#C58940" : "transparent",
                    "&:hover": {
                      bgcolor:
                        filter === eventType
                          ? "#A67535"
                          : "rgba(197, 137, 64, 0.04)",
                    },
                    borderColor: filter !== eventType ? "#E5BA73" : undefined,
                  }}
                >
                  {eventType}
                </Button>
              ))}
              <Button
                variant={filter === null ? "contained" : "outlined"}
                onClick={() => handleFilterChange(null)}
                sx={{
                  bgcolor: filter === null ? "#C58940" : "transparent",
                  "&:hover": {
                    bgcolor:
                      filter === null ? "#A67535" : "rgba(197, 137, 64, 0.04)",
                  },
                  borderColor: filter !== null ? "#E5BA73" : undefined,
                }}
              >
                Show All
              </Button>
            </Stack>
          </Paper>

          {/* Themes Grid */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <CircularProgress sx={{ color: "#C58940" }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent:
                  filteredThemes.length === 0 ? "center" : "flex-start",
              }}
            >
              {filteredThemes.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    mt: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    width: "100%",
                    maxWidth: 500,
                  }}
                >
                  <Typography variant="h6" color="#705B35">
                    No themes found for this filter.
                  </Typography>
                  <Typography variant="body2" color="#705B35" sx={{ mt: 1 }}>
                    Try selecting a different filter or create a new theme.
                  </Typography>
                </Paper>
              ) : (
                filteredThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 16px)",
                        md: "calc(33.33% - 16px)",
                      },
                      display: "flex",
                      flexDirection: "column",
                      height: 420, // Set a fixed height for all cards
                    }}
                    elevation={3}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 180, // Fixed height for image container
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={theme.img}
                        alt={theme.themeName}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // This will maintain aspect ratio while covering the area
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        pb: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Chip
                          label={theme.eventName}
                          variant="filled"
                          size="small"
                          sx={{ bgcolor: "#FAEAB1", color: "#705B35" }}
                        />
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            color: "#C58940",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <AttachMoneyIcon fontSize="small" />
                          {theme.price.toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="#433520"
                        gutterBottom
                      >
                        {theme.themeName}
                      </Typography>

                      {theme.color && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <ColorLensIcon
                            sx={{ color: "#C58940", fontSize: 20, mr: 1 }}
                          />
                          <Typography variant="body2" color="#705B35">
                            {theme.color}
                          </Typography>
                        </Box>
                      )}

                      {theme.description && (
                        <Typography
                          variant="body2"
                          color="#705B35"
                          sx={{
                            mt: 1,
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {theme.description}
                        </Typography>
                      )}
                    </CardContent>

                    <Box sx={{ mt: "auto" }}>
                      <Divider sx={{ mx: 2, borderColor: "#E5BA73" }} />

                      <CardActions
                        sx={{ justifyContent: "space-between", p: 2 }}
                      >
                        <Button
                          startIcon={<EditIcon />}
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(theme)}
                          sx={{ borderColor: "#E5BA73", color: "#C58940" }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            setConfirmDelete({
                              id: theme.id,
                              themeName: theme.themeName,
                            })
                          }
                          color="error"
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editingId !== null}
        onClose={handleCancelEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#FAEAB1", color: "#433520", py: 2 }}>
          Edit Event Theme
          <IconButton
            onClick={handleCancelEdit}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#C58940",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Event Type"
              name="eventName"
              value={editData.eventName || ""}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: "#C58940" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Theme Name"
              name="themeName"
              value={editData.themeName || ""}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Chip
                      label="THEME"
                      size="small"
                      sx={{
                        bgcolor: "#FAEAB1",
                        color: "#705B35",
                        borderColor: "#E5BA73",
                      }}
                      variant="outlined"
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Color"
              name="color"
              value={editData.color || ""}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ColorLensIcon sx={{ color: "#C58940" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={editData.price || ""}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: "#C58940" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Image URL"
              name="img"
              value={editData.img || ""}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddPhotoAlternateIcon sx={{ color: "#C58940" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={editData.description || ""}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCancelEdit} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ bgcolor: "#C58940", "&:hover": { bgcolor: "#A67535" } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#433520" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="#705B35">
            Are you sure you want to delete this theme? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmDelete(null)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() =>
              confirmDelete &&
              handleDelete(confirmDelete.id, confirmDelete.themeName)
            }
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbars */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%", bgcolor: "#C58940", color: "#FAF8F1" }}
          variant="filled"
          elevation={6}
        >
          Event theme updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openFailedSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseDeleteSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseDeleteSnackbar}
          severity="success"
          sx={{ width: "100%", bgcolor: "#C58940", color: "#FAF8F1" }}
          variant="filled"
          elevation={6}
        >
          Event theme Can not Delete 
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseDeleteSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseDeleteSnackbar}
          severity="success"
          sx={{ width: "100%", bgcolor: "#C58940", color: "#FAF8F1" }}
          variant="filled"
          elevation={6}
        >
          Event theme deleted successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AllEventThemes;
