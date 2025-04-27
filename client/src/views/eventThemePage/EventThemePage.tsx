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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { EventData } from "../../api/sampleData";
import { EventThemeSchema } from "../../api/eventThemeApi";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClients";
import { createEventTheme } from "../../api/eventThemeApi";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";

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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={500} color="primary">
          Create New Event
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details below to create a new themed event.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate>
          <Stack spacing={3}>
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

            <TextField
              {...register("themeName", { required: "Theme name is required" })}
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
                      color="primary"
                      variant="outlined"
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...register("price", {
                valueAsNumber: true,
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              label="Price"
              type="number"
              fullWidth
              error={!!errors.price}
              helperText={errors.price?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
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

            <Controller
              name="img"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Image URL"
                  fullWidth
                  error={!!errors.img}
                  helperText={errors.img?.message || "Enter an image URL or ID"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AddPhotoAlternateIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={() => reset()}
                sx={{ width: "48%" }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ width: "48%" }}
              >
                Create Event
              </Button>
              <Button component={Link} to="/admin/allEventThemes">
                All Themes
              </Button>
              <Button
                variant="outlined"
                onClick={() => reset()}
                sx={{ width: "48%" }}
              >
                Reset
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Event theme created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateEventPage;
