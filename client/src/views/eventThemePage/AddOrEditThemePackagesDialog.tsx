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
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const resetForm = () => {
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
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
          <Controller
            name="packageName"
            control={control}
            defaultValue={defaultValues?.packageName}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(event, newValue) => field.onChange(newValue)}
                value={PackageNameData.find((pkg) => pkg.name === field.value)}
                options={PackageNameData}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.packageName}
                    helperText={errors.packageName && "Required"}
                    label="Package Name"
                  />
                )}
              />
            )}
          />

          <TextField
            required
            id="packagePrice"
            type="number"
            label="Package Price"
            error={!!errors.packagePrice}
            helperText={errors.packagePrice && "Required"}
            size="small"
            sx={{ flex: 1, margin: "0.5rem" }}
            {...register("packagePrice", { required: true })}
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
            resetForm();
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
              id: data.id || generateRandomId(),
            };
            onSave(finalData);
            resetForm();
            onClose();
          })}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
