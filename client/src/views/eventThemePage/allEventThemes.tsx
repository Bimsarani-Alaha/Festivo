import React, { useEffect, useState } from "react";
import axios from "axios";
import { EventThemeSchema, updateEventTheme, deleteEventTheme } from "../../api/eventThemeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Snackbar, Button } from "@mui/material"; // Import Material UI components

const AllEventThemes: React.FC = () => {
  const [themes, setThemes] = useState<EventThemeSchema[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<EventThemeSchema[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EventThemeSchema>>({});
  const [filter, setFilter] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to handle snackbar visibility for update
  const [deleteSnackbar, setDeleteSnackbar] = useState(false); // State to handle snackbar visibility for delete

  const queryClient = useQueryClient(); // Hook to invalidate cache on mutation

  // Fetch all event themes
  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    // Filter themes based on the selected event type
    if (filter) {
      setFilteredThemes(themes.filter((theme) => theme.eventName === filter));
    } else {
      setFilteredThemes(themes); // Show all themes if no filter is applied
    }
  }, [filter, themes]);

  const fetchThemes = async () => {
    try {
      const response = await axios.get<EventThemeSchema[]>("/public/event-theme");
      setThemes(response.data);
    } catch (error) {
      console.error("Failed to fetch event themes", error);
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
      fetchThemes(); // Refresh list after updating
      setEditingId(null);
      setEditData({});
      setOpenSnackbar(true); // Show snackbar on successful update
    },
    onError: (error) => {
      console.error("Failed to update event theme", error);
    },
  });

  const { mutate: deleteEventThemeMutation } = useMutation({
    mutationFn: deleteEventTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EventTheme"] });
      fetchThemes(); // Refresh list after deletion
      setDeleteSnackbar(true); // Show snackbar on successful deletion
    },
    onError: (error) => {
      console.error("Failed to delete event theme", error);
    },
  });

  const handleSave = () => {
    if (!editingId) return;

    // Ensure all fields are present in editData, providing fallback values if necessary
    const updatedTheme: EventThemeSchema = {
      id: editingId,
      eventName: editData.eventName || '', // Default to empty string if undefined
      themeName: editData.themeName || '', // Default to empty string if undefined
      color: editData.color || '', // Default to empty string if undefined
      price: editData.price ?? 0, // Default to 0 if undefined
      description: editData.description ?? '', // Default to empty string if null or undefined
      img: editData.img || '', // Default to empty string if undefined
    };

    updateEventThemeMutation(updatedTheme);
  };

  const handleDelete = (theme: EventThemeSchema) => {
    if (window.confirm("Are you sure you want to delete this theme?")) {
      deleteEventThemeMutation(theme.id); // Pass the theme ID to the delete mutation
    }
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
    setOpenSnackbar(false); // Close the update snackbar
  };

  const handleCloseDeleteSnackbar = () => {
    setDeleteSnackbar(false); // Close the delete snackbar
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Event Themes</h1>

      {/* Filter buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => handleFilterChange("Birthday")}>Birthday</button>
        <button onClick={() => handleFilterChange("Proposal")}>Proposal</button>
        <button onClick={() => handleFilterChange("Gender Reveal")}>Gender Reveal</button>
        <button onClick={() => handleFilterChange(null)}>Show All</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "300px",
              borderRadius: "10px",
            }}
          >
            <img
              src={theme.img}
              alt={theme.themeName}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />

            {editingId === theme.id ? (
              <div>
                <input
                  type="text"
                  name="eventName"
                  value={editData.eventName || ""}
                  onChange={handleChange}
                  placeholder="Event Name"
                  style={{ width: "100%", marginBottom: "8px" }}
                />
                <input
                  type="text"
                  name="themeName"
                  value={editData.themeName || ""}
                  onChange={handleChange}
                  placeholder="Theme Name"
                  style={{ width: "100%", marginBottom: "8px" }}
                />
                <input
                  type="text"
                  name="color"
                  value={editData.color || ""}
                  onChange={handleChange}
                  placeholder="Color"
                  style={{ width: "100%", marginBottom: "8px" }}
                />
                <input
                  type="number"
                  name="price"
                  value={editData.price || ""}
                  onChange={handleChange}
                  placeholder="Price"
                  style={{ width: "100%", marginBottom: "8px" }}
                />
                <button
                  onClick={handleSave}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h3>
                  {theme.eventName} - {theme.themeName}
                </h3>
                <p>Color: {theme.color}</p>
                <p>Price: Rs.{theme.price.toLocaleString()}</p>
                <button
                  onClick={() => handleEdit(theme)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(theme)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Snackbar for success message after update */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Snackbar will disappear after 6 seconds
        onClose={handleCloseSnackbar}
        message="Event theme updated successfully!"
        action={
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            CLOSE
          </Button>
        }
      />

      {/* Snackbar for success message after delete */}
      <Snackbar
        open={deleteSnackbar}
        autoHideDuration={6000} // Snackbar will disappear after 6 seconds
        onClose={handleCloseDeleteSnackbar}
        message="Event theme deleted successfully!"
        action={
          <Button color="secondary" size="small" onClick={handleCloseDeleteSnackbar}>
            CLOSE
          </Button>
        }
      />
    </div>
  );
};

export default AllEventThemes;
