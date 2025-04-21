import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Container,
  CircularProgress,
  Box,
  Button,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchThemesByEvent } from "../../api/eventThemeApi";
import Logo from "../../assets/Logo.jpg"; // fallback image
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import PaletteIcon from "@mui/icons-material/Palette";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";

const DisplayEventTheme = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["eventThemes", eventName],
    queryFn: () => fetchThemesByEvent(eventName!), // ✅ fixed: call with eventName
    enabled: !!eventName, // only fetch if eventName exists
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Failed to load event themes.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
        {eventName} Themes
      </Typography>
      <Grid container spacing={4}>
        {data?.map((theme: any) => (
          <Grid item xs={12} sm={6} md={4} key={theme.id}>
            <Card
              sx={{
                width: "20rem",
                height: "40rem",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 24px rgba(229, 186, 115, 0.25)",
                },
                border: "1px solid rgba(229, 186, 115, 0.2)",
                position: "relative",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Favorite button */}
              <IconButton
                size="small"
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "white" },
                  zIndex: 2,
                  padding: "4px",
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon fontSize="small" sx={{ color: "#e91e63" }} />
                ) : (
                  <FavoriteBorderIcon
                    fontSize="small"
                    sx={{ color: "#614A29" }}
                  />
                )}
              </IconButton>

              {/* Featured tag if applicable */}
              {theme.featured && (
                <Chip
                  icon={<StarIcon fontSize="small" />}
                  label="Featured"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "#E5BA73",
                    color: "white",
                    fontWeight: 600,
                    zIndex: 2,
                  }}
                />
              )}

              {/* Image with overlay on hover */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                //   height="15"
                  image={theme.img || Logo}
                  alt={theme.themeName}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    height: "25rem",
                  }}
                />
                {isHovered && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.3)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon fontSize="small" />}
                      size="small"
                      sx={{
                        bgcolor: "white",
                        color: "#614A29",
                        "&:hover": {
                          bgcolor: "white",
                          filter: "brightness(0.95)",
                        },
                        borderRadius: 28,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        textTransform: "none",
                        fontWeight: 500,
                        px: 2,
                        py: 0.5,
                      }}
                    >
                      View
                    </Button>
                  </Box>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#614A29",
                    fontSize: "1.1rem",
                  }}
                >
                  {theme.themeName}
                </Typography>

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EventIcon
                      fontSize="small"
                      sx={{ color: "#866A40", fontSize: "1rem" }}
                    />
                    <Typography
                      variant="body2"
                      color="#866A40"
                      fontSize="0.85rem"
                    >
                      {theme.eventName}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PaletteIcon
                      fontSize="small"
                      sx={{ color: "#866A40", fontSize: "1rem" }}
                    />
                    <Typography
                      variant="body2"
                      color="#866A40"
                      fontSize="0.85rem"
                    >
                      {theme.color}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AttachMoneyIcon
                      fontSize="small"
                      sx={{ color: "#866A40", fontSize: "1rem" }}
                    />
                    <Typography
                      variant="body2"
                      color="#866A40"
                      fontWeight={500}
                      fontSize="0.85rem"
                    >
                      ₹{theme.price}
                    </Typography>
                  </Box>
                </Stack>

                {theme.description && (
                  <Typography
                    variant="body2"
                    mt={2}
                    sx={{
                      color: "#614A29",
                      opacity: 0.85,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "0.85rem",
                    }}
                  >
                    {theme.description}
                  </Typography>
                )}

                {/* Bottom action button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 2,
                    bgcolor: "#E5BA73",
                    color: "white",
                    "&:hover": { bgcolor: "#D4A85F" },
                    borderRadius: 28,
                    py: 1,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(229, 186, 115, 0.2)",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  Select Theme
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DisplayEventTheme;
