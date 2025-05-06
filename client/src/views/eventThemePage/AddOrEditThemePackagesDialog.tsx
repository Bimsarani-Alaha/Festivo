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
} from "@mui/material";
import { PackageNameData, ThemePackage } from "../../api/eventThemeApi";
import { Controller, useForm } from "react-hook-form";
import RichTextComponent from "../../Components/RichTextComponent";
import { generateRandomId } from "../../state/randomNumber";

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

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset({
          packageName: "",
          packagePrice: 0,
          description: "",
          id: "",
        });
        onClose();
      }}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { minHeight: "80vh" } }}
    >
      <DialogTitle>
        {defaultValues ? "Edit Theme Packages" : "Add Theme Packages"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack
          sx={{
            display: "flex",
            padding: "0.5rem",
            borderRadius: "0.3rem",
            gap: "1rem",
          }}
        >
          {defaultValues?.packageName ? (
            <Typography>{defaultValues.packageName}</Typography>
          ) : (
            <Controller
              name="packageName"
              control={control}
              rules={{ required: "Package Name is required" }}
              render={({ field }) => (
                <Autocomplete
                  sx={{ p: "0.5rem" }}
                  options={PackageNameData.map((pkg) => pkg.name)}
                  value={field.value || null}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Package Name"
                      error={!!errors.packageName}
                      helperText={errors.packageName?.message}
                      required
                      fullWidth
                    />
                  )}
                />
              )}
            />
          )}

          <TextField
            required
            id="packagePrice"
            type="number"
            label="Package Price"
            error={!!errors.packagePrice}
            helperText={errors.packagePrice && "Required"}
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("packagePrice", {
              required: true,
              valueAsNumber: true,
            })}
          />

          <Controller
            control={control}
            name={"description"}
            render={({ field }) => {
              return (
                <RichTextComponent
                  onChange={(e) => field.onChange(e)}
                  placeholder={field.value ?? "Description"}
                />
              );
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            reset({
              packageName: "",
              packagePrice: 0,
              description: "",
              id: "",
            });
            onClose();
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
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
