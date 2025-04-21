import React, { useEffect } from "react";
import {
  Autocomplete,
  TextareaAutosize,
  TextField,
  Button,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { EventData } from "../../api/sampleData";
import { EventThemeSchema } from "../../api/eventThemeApi";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClients";
import { createEventTheme } from "../../api/eventThemeApi"; // make sure this exists

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
    formState: { errors },
  } = useForm<EventThemeSchema>({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const { mutate: createEventThemeMutation } = useMutation({
    mutationFn: createEventTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EventTheme"] });
      if (onSubmit) onSubmit(defaultValues!); // optional callback
      reset(); // reset the form after submission
    },
    onError: (error) => {
      console.error("Failed to create event theme", error);
    },
  });

  const submitHandler = (data: EventThemeSchema) => {
    createEventThemeMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Controller
        name="eventName"
        control={control}
        render={({ field }) => (
          <Autocomplete
            size="small"
            options={EventData.map((event) => event.name)}
            value={field.value || ""}
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Event"
                error={!!errors.eventName}
                helperText={errors.eventName?.message}
                required
                margin="normal"
                fullWidth
              />
            )}
          />
        )}
      />

      <TextField
        {...register("themeName")}
        label="Theme Name"
        fullWidth
        margin="normal"
        error={!!errors.themeName}
        helperText={errors.themeName?.message}
      />

      <TextField
        {...register("price", { valueAsNumber: true })}
        label="Price"
        type="number"
        fullWidth
        margin="normal"
        error={!!errors.price}
        helperText={errors.price?.message}
      />

      <TextareaAutosize
        {...register("description")}
        minRows={3}
        placeholder="Description"
        style={{ width: "100%", marginTop: "1rem", padding: "0.5rem" }}
      />
      {errors.description && (
        <p style={{ color: "red" }}>{errors.description.message}</p>
      )}

      <TextField
        {...register("img", { valueAsNumber: true })}
        label="Image"
        fullWidth
        margin="normal"
        error={!!errors.img}
        helperText={errors.img?.message}
      />

      <TextField
        {...register("color")}
        label="Theme Color"
        fullWidth
        margin="normal"
        error={!!errors.color}
        helperText={errors.color?.message}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        
      >
        Submit
      </Button>
    </form>
  );
};

export default CreateEventPage;
