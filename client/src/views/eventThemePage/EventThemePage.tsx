import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  InputAdornment,
  Stack,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { EventData } from "../../api/sampleData";
import { EventThemeSchema, ThemePackage } from "../../api/eventThemeApi";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClients";
import { createEventTheme } from "../../api/eventThemeApi";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import AddOrEditPackageDialog from "./AddOrEditThemePackagesDialog";
import { DeleteOutline, EditCalendarOutlined } from "@mui/icons-material";

// Custom MUI theme
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
  },
});

type CreateEventPageProps = {
  defaultValues?: EventThemeSchema;
  onSubmit?: (data: EventThemeSchema) => void;
};

const CreateEventPage: React.FC<CreateEventPageProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventThemeSchema>({
    defaultValues,
    mode: "onChange",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const { mutate: createEventThemeMutation } = useMutation({
    mutationFn: createEventTheme,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["EventTheme"] });
      if (onSubmit) onSubmit(data);
      reset();
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.error("Failed to create event theme", error);
    },
  });

  const submitHandler = (data: EventThemeSchema) => {
    createEventThemeMutation(data);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpen = () => {
    setSelectedConsumption(null);
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedConsumption(null); // Reset selected package when closing
  };

  const handleSave = (data: ThemePackage) => {
    const currentPackages = watch("themePackage") || [];

    // If editing (selectedConsumption exists), exclude it from duplicate check
    const packagesToCheck = selectedConsumption
      ? currentPackages.filter((pkg) => pkg.id !== selectedConsumption.id)
      : currentPackages;

    const isDuplicate = packagesToCheck.some(
      (pkg: ThemePackage) =>
        pkg.packageName.trim().toLowerCase() ===
        data.packageName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("You can't add the same package twice.");
      return;
    }

    // If editing, replace the package, otherwise add new
    if (selectedConsumption) {
      setValue(
        "themePackage",
        currentPackages.map((pkg) =>
          pkg.id === selectedConsumption.id ? data : pkg
        )
      );
    } else {
      setValue("themePackage", [...currentPackages, data]);
    }
  };

  const [openAddOrEditAdditionalDialog, setOpenAddOrEditAdditionalDialog] =
    useState(false);
  const [selectedConsumption, setSelectedConsumption] =
    useState<ThemePackage | null>(null);
  const packageColorMap: Record<string, string> = {
    luxury: "#e3f2fd",
    basic: "#fce4ec",
    premium: "#e8f5e9",
  };
  const themePackageWatch = watch("themePackage");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#FAF8F1", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="lg">
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(197, 137, 64, 0.15)",
            }}
          >
            <Box sx={{ bgcolor: "#FAEAB1", py: 2, px: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight={600}
                color="#433520"
              >
                Create New Event
              </Typography>
              <Typography variant="body1" color="#705B35" sx={{ opacity: 0.9 }}>
                Fill in the details below to create a new themed event.
              </Typography>
            </Box>

            <CardContent sx={{ p: 4, bgcolor: "#FFFFFF" }}>
              <Box
                component="form"
                onSubmit={handleSubmit(submitHandler)}
                noValidate
              >
                <Stack spacing={3.5}>
                  {/* Event Type */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <EventIcon sx={{ mt: 2, color: "#C58940" }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        gutterBottom
                        color="#433520"
                      >
                        Event Information
                      </Typography>
                      <Controller
                        name="eventName"
                        control={control}
                        rules={{ required: "Event name is required" }}
                        render={({ field }) => (
                          <Autocomplete
                            options={EventData.map((event) => event.name)}
                            value={field.value || null}
                            onChange={(_, value) => field.onChange(value)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Event Type"
                                error={!!errors.eventName}
                                helperText={errors.eventName?.message}
                                required
                                fullWidth
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  {/* Theme Name */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Chip
                      label="T"
                      size="small"
                      sx={{
                        mt: 2,
                        minWidth: 24,
                        height: 24,
                        bgcolor: "#E5BA73",
                        color: "#FFFFFF",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        gutterBottom
                        color="#433520"
                      >
                        Theme Details
                      </Typography>
                      <TextField
                        {...register("themeName", {
                          required: "Theme name is required",
                          validate: (value) =>
                            /^[^0-9]*$/.test(value) ||
                            "Theme name cannot contain numbers",
                        })}
                        label="Theme Name"
                        fullWidth
                        error={!!errors.themeName}
                        helperText={errors.themeName?.message}
                        placeholder="Enter a catchy theme name"
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
                    </Box>
                  </Box>

                  {/* Price */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Typography
                      sx={{ mt: 2, color: "#C58940", fontWeight: "bold" }}
                    >
                      LKR
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        gutterBottom
                        color="#433520"
                      >
                        Pricing
                      </Typography>
                      <TextField
                        {...register("price", {
                          valueAsNumber: true,
                          required: "Price is required",
                          min: {
                            value: 0,
                            message: "Price cannot be negative",
                          },
                          validate: (value) =>
                            (typeof value === "number" && !isNaN(value)) ||
                            "Only numeric values allowed",
                        })}
                        label="Price"
                        type="number"
                        fullWidth
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography
                                sx={{ color: "#C58940", fontWeight: 500 }}
                              >
                                LKR
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <DescriptionIcon sx={{ mt: 2, color: "#C58940" }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        gutterBottom
                        color="#433520"
                      >
                        Event Description
                      </Typography>
                      <TextField
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 20,
                            message:
                              "Description must be at least 20 characters",
                          },
                        })}
                        label="Description"
                        multiline
                        minRows={4}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Describe your event theme in detail..."
                      />
                    </Box>
                  </Box>

                  {/* Image URL */}
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <AddPhotoAlternateIcon sx={{ mt: 2, color: "#C58940" }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        gutterBottom
                        color="#433520"
                      >
                        Event Image
                      </Typography>
                      <Controller
                        name="img"
                        control={control}
                        rules={{
                          required: "Image URL is required",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Image URL"
                            fullWidth
                            error={!!errors.img}
                            helperText={
                              errors.img?.message || "Enter an image URL or ID"
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AddPhotoAlternateIcon
                                    sx={{ color: "#C58940" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <Stack>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap={2}
                      justifyContent="center"
                    >
                      {themePackageWatch?.length > 0 ? (
                        themePackageWatch.map((row) => {
                          const colorKey = row.packageName.toLowerCase();
                          const bgColor = packageColorMap[colorKey] || "#fff";

                          return (
                            <Card
                              key={row.id}
                              sx={{
                                width: 280,
                                borderRadius: 3,
                                boxShadow: 3,
                                position: "relative",
                                backgroundColor: bgColor,
                              }}
                            >
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {row.packageName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>ID:</strong> {row.id}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>Price:</strong> ${row.packagePrice}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  <strong>Description:</strong>{" "}
                                  {row.description}
                                </Typography>
                                <Box
                                  display="flex"
                                  justifyContent="flex-end"
                                  mt={2}
                                  gap={1}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedConsumption(row); // This sets the package to edit
                                      setDialogOpen(true);
                                    }}
                                  >
                                    <EditCalendarOutlined fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setValue(
                                        "themePackage",
                                        themePackageWatch.filter(
                                          (item) => item.id !== row.id
                                        )
                                      );
                                    }}
                                  >
                                    <DeleteOutline fontSize="small" />
                                  </IconButton>
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })
                      ) : (
                        <Box width="100%" textAlign="center" mt={2}>
                          <Typography variant="body2" color="text.secondary">
                            No packages added yet
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>

                  <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
                    <Button
                      onClick={handleOpen}
                      variant="outlined"
                      size="large"
                      sx={{
                        flexGrow: 1,
                        borderColor: "#E5BA73",
                        color: "#C58940",
                      }}
                    >
                      Add Theme Pakages
                    </Button>
                    <AddOrEditPackageDialog
                      open={dialogOpen}
                      onClose={handleClose}
                      onSave={handleSave}
                      defaultValues={selectedConsumption || undefined}
                    />
                  </Box>

                  <Divider sx={{ my: 1, borderColor: "#E5BA73" }} />

                  {/* Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => reset()}
                        size="large"
                        sx={{
                          flexGrow: 1,
                          borderColor: "#E5BA73",
                          color: "#C58940",
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          flexGrow: 1,
                          bgcolor: "#C58940",
                          "&:hover": { bgcolor: "#A67535" },
                        }}
                        disabled={isSubmitting}
                      >
                        Create Event
                      </Button>
                    </Box>
                    <Button
                      component={Link}
                      to="/admin/allEventThemes"
                      variant="text"
                      sx={{ color: "#C58940" }}
                    >
                      View All Themes
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
          {openAddOrEditAdditionalDialog && (
            <AddOrEditPackageDialog
              open={openAddOrEditAdditionalDialog}
              onClose={() => setOpenAddOrEditAdditionalDialog(false)}
              onSave={(data) => {
                console.log("Adding new Consumption", data);
                if (selectedConsumption) {
                  // Trying to update
                  setValue("themePackage", [
                    ...(themePackageWatch ?? []).map((item) => {
                      if (item.id === selectedConsumption.id) {
                        return data;
                      }
                      return item;
                    }),
                  ]);
                } else {
                  // Adding new
                  setValue("themePackage", [
                    ...(themePackageWatch ?? []),
                    data,
                  ]);
                }
                setOpenAddOrEditAdditionalDialog(false);
                setSelectedConsumption(null);
              }}
              defaultValues={selectedConsumption ?? undefined}
            />
          )}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: "100%", bgcolor: "#C58940", color: "#FAF8F1" }}
              variant="filled"
              elevation={6}
            >
              Event theme created successfully!
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CreateEventPage;
