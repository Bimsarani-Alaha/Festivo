import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Autocomplete,
  Stack,
  Typography,
  Box,
  Paper,
  Fade,
  IconButton,
} from "@mui/material";
import { PackageNameData, ThemePackage } from "../../api/eventThemeApi";
import { Controller, useForm } from "react-hook-form";
import RichTextComponent from "../../Components/RichTextComponent";
import { generateRandomId } from "../../state/randomNumber";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";

// Color palette
const colors = {
  cream: "#FFFFFF", // Background color
  lightYellow: "#FAF8F1", // Secondary elements
  goldenrod: "#E5BA73", // Accent elements
  bronze: "#E5BA73", // Primary actions
  black: "000000",
};

type Props = {
  open: boolean;
  onClose: () => void;
  defaultValues?: ThemePackage;
  onSave: (data: ThemePackage) => void;
};

export default function AddOrEditPackageDialog({
  open,
  onClose,
  defaultValues,
  onSave,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ThemePackage>({
    defaultValues: {
      packageName: "",
      packagePrice: 0,
      description: "",
      id: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          packageName: "",
          packagePrice: 0,
          description: "",
          id: "",
        });
      }
    }
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset({
      packageName: "",
      packagePrice: 0,
      description: "",
      id: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{ 
        sx: { 
          minHeight: "80vh",
          backgroundColor: colors.cream,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(197, 137, 64, 0.15)"
        } 
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.bronze,
          padding: "16px 24px",
          color: "white",
        }}
      >
        <Typography variant="h5" fontWeight="600">
          {defaultValues ? "Edit Theme Package" : "Create New Theme Package"}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent 
        sx={{ 
          padding: "24px", 
          backgroundColor: colors.cream,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: "28px",
            backgroundColor: colors.lightYellow,
            borderRadius: "12px",
            mb: 3,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: colors.black,
              fontWeight: "500",
              marginBottom: "30px",
            }}
          >
            Complete the form below to {defaultValues ? "update" : "create"} your theme package.
            All fields marked with an asterisk (*) are required.
          </Typography>
        </Paper>

        <Stack
          sx={{
            display: "flex",
            padding: "0.5rem",
            borderRadius: "12px",
            gap: "1.5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "12px",
              backgroundColor: colors.cream,
              borderRadius: "8px",
              border: `1px solid ${colors.lightYellow}`,
            }}
          >
            <LocalOfferIcon sx={{ color: colors.bronze }} />
            {defaultValues?.packageName ? (
              <Typography
                variant="h6"
                sx={{
                  color: colors.bronze,
                  fontWeight: "500",
                }}
              >
                {defaultValues.packageName}
              </Typography>
            ) : (
              <Controller
                name="packageName"
                control={control}
                rules={{ required: "Package Name is required" }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    options={PackageNameData.map((pkg) => pkg.name)}
                    value={field.value || null}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Package Name *"
                        error={!!errors.packageName}
                        helperText={errors.packageName?.message}
                        required
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.bronze,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: colors.bronze,
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "12px",
              backgroundColor: colors.cream,
              borderRadius: "8px",
              border: `1px solid ${colors.lightYellow}`,
            }}
          >
            <MonetizationOnIcon sx={{ color: colors.bronze }} />
            <TextField
              required
              id="packagePrice"
              type="number"
              label="Package Price *"
              error={!!errors.packagePrice}
              helperText={errors.packagePrice && "Required"}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <Typography
                    variant="body1"
                    sx={{ color: colors.bronze, marginRight: "8px" }}
                  >
                    LKR
                  </Typography>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.bronze,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: colors.bronze,
                },
              }}
              {...register("packagePrice", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "16px",
              backgroundColor: colors.cream,
              borderRadius: "8px",
              border: `1px solid ${colors.lightYellow}`,
            }}
          >
            <Box display="flex" alignItems="center" gap="8px">
              <DescriptionIcon sx={{ color: colors.bronze }} />
              <Typography
                variant="body1"
                sx={{
                  color: colors.bronze,
                  fontWeight: "500",
                }}
              >
                Package Description
              </Typography>
            </Box>
            <Controller
              control={control}
              name={"description"}
              render={({ field }) => {
                return (
                  <Box
                    sx={{
                      border: `1px solid ${colors.lightYellow}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <RichTextComponent
                      onChange={(e) => field.onChange(e)}
                      placeholder={field.value ?? "Description"}
                    />
                  </Box>
                );
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
          padding: "16px 24px",
          backgroundColor: colors.lightYellow,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            color: colors.bronze,
            borderColor: colors.bronze,
            borderRadius: "8px",
            padding: "8px 24px",
            fontWeight: 600,
            "&:hover": {
              borderColor: colors.bronze,
              backgroundColor: "rgba(229, 186, 115, 0.08)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit((data) => {
            const finalData = {
              ...data,
              id: defaultValues?.id || generateRandomId(),
            };
            onSave(finalData);
            reset({
              packageName: "",
              packagePrice: 0,
              description: "",
              id: "",
            });
            onClose();
          })}
          sx={{
            backgroundColor: colors.bronze,
            color: "white",
            borderRadius: "8px",
            padding: "8px 24px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#B47833",
            },
          }}
        >
          {defaultValues ? "Update Package" : "Save Package"}
        </Button>
      </Box>
    </Dialog>
  );
}