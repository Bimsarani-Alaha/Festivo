import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Container,
  CircularProgress,
  Button,
  IconButton,
  Chip,
  Divider,
  Paper,
  Stack,
  Fade,
  Zoom,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchThemesByEvent } from "../../api/eventThemeApi";
import Logo from "../../assets/Logo.jpg";
import { useParams, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import DescriptionIcon from '@mui/icons-material/Description';

// Define TypeScript interfaces for the data structures
interface ThemePackage {
  id: number | string;
  packageName: string;
  packagePrice: number;
  description: string;
}

interface Theme {
  id: number | string;
  themeName: string;
  eventName: string;
  color: string;
  price: number;
  featured?: boolean;
  img?: string;
  description?: string;
  themePackage?: ThemePackage[];
}

interface FavoritesState {
  [key: string | number]: boolean;
}

const DisplayEventTheme: React.FC = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [favorites, setFavorites] = useState<FavoritesState>({});
  const [selectedPackage, setSelectedPackage] = useState<ThemePackage | null>(null);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["eventThemes", eventName],
    queryFn: () => fetchThemesByEvent(eventName!),
    enabled: !!eventName,
  });

  const handleSelectTheme = (theme: Theme): void => {
    if (!selectedPackage && theme.themePackage && theme.themePackage.length > 0) {
      // Don't navigate if no package is selected when packages are available
      return;
    }
    
    navigate("/Eventbooking", { 
      state: { 
        selectedTheme: theme,
        selectedPackage: selectedPackage 
      } 
    });
  };
  const toggleFavorite = (
    id: string | number,
    event: React.MouseEvent
  ): void => {
    event.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
          sx={{
            backgroundImage: "linear-gradient(to bottom, #fff9f2, #ffffff)",
          }}
        >
          <CircularProgress sx={{ color: "#E5BA73" }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <Box
          textAlign="center"
          py={8}
          sx={{
            backgroundImage: "linear-gradient(to bottom, #fff9f2, #ffffff)",
          }}
        >
          <Typography variant="h6" color="error">
            Failed to load event themes.
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 2,
              borderColor: "#E5BA73",
              color: "#614A29",
              "&:hover": {
                borderColor: "#D4A85F",
              },
            }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
        <Footer />
      </>
    );
  }

  const themes = data as Theme[];

  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundImage: "linear-gradient(to bottom, #fff9f2, #ffffff)",
          minHeight: "100vh",
          pt: 6,
          pb: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                color: "#614A29",
                fontWeight: 700,
                mb: 1,
              }}
            >
              {eventName} Themes
            </Typography>

            <Divider
              sx={{
                width: "120px",
                mx: "auto",
                my: 2,
                borderColor: "#E5BA73",
                borderWidth: 2,
              }}
            />

            <Typography
              variant="subtitle1"
              color="#866A40"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                opacity: 0.9,
              }}
            >
              Choose from our curated selection of {eventName?.toLowerCase()}{" "}
              themes to create your perfect event
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 2, sm: 3, md: 4 },
              justifyContent: "center",
            }}
          >
            {themes?.map((theme, index) => (
              <Zoom
                in={true}
                style={{ transitionDelay: `${index * 100}ms` }}
                key={theme.id}
              >
                <Card
                  sx={{
                    width: { xs: "100%", sm: "320px", md: "340px" },
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 30px rgba(229, 186, 115, 0.25)",
                    },
                    border: "1px solid rgba(229, 186, 115, 0.2)",
                    position: "relative",
                    background: "#ffffff",
                  }}
                  onMouseEnter={() => setHoveredId(theme.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Favorite Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => toggleFavorite(theme.id, e)}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "rgba(255,255,255,0.9)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.95)",
                        transform: "scale(1.1)",
                      },
                      zIndex: 2,
                      padding: "6px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {favorites[theme.id] ? (
                      <FavoriteIcon sx={{ color: "#e91e63" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "#614A29" }} />
                    )}
                  </IconButton>

                  {/* Featured Chip */}
                  {theme.featured && (
                    <Chip
                      icon={<StarIcon />}
                      label="Featured"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background:
                          "linear-gradient(135deg, #E5BA73 0%, #D4A85F 100%)",
                        color: "white",
                        fontWeight: 600,
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "& .MuiChip-icon": {
                          color: "white",
                          fontSize: "18px",
                        },
                      }}
                    />
                  )}

                  {/* Image Section */}
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={theme.img || Logo}
                      alt={theme.themeName}
                      sx={{
                        height: "240px",
                        objectFit: "cover",
                        transition: "transform 0.8s ease",
                        transform:
                          hoveredId === theme.id ? "scale(1.08)" : "scale(1)",
                      }}
                    />
                  </Box>

                  {/* Content Section */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      transition: "all 0.3s ease",
                      background: "transparent",
                    }}
                  >
                    {/* Theme Name */}
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#614A29",
                        fontWeight: 700,
                        mb: 2,
                        fontSize: "1.5rem",
                        textAlign: "center",
                        position: "relative",
                        "&:after": {
                          content: '""',
                          display: "block",
                          width: "60px",
                          height: "3px",
                          background: "#E5BA73",
                          margin: "12px auto 0",
                          borderRadius: 3,
                        },
                      }}
                    >
                      {theme.themeName}
                    </Typography>

                    {/* Theme Details */}
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "rgba(229,186,115,0.1)",
                          borderRadius: 2,
                        }}
                      >
                        <EventIcon sx={{ color: "#866A40" }} />
                        <Typography color="#866A40" fontWeight={500}>
                          {theme.eventName}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "rgba(229,186,115,0.1)",
                          borderRadius: 2,
                        }}
                      >
                        <AttachMoneyIcon sx={{ color: "#866A40" }} />
                        <Typography color="#866A40" fontWeight={600}>
                          LKR {theme.price.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Description */}
                    {theme.description && (
                      <Fade in={true}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 3,
                            background: "rgba(255,255,255,0.7)",
                            borderRadius: 2,
                            border: "1px solid rgba(229, 186, 115, 0.3)",
                            boxShadow: "0 4px 12px rgba(229, 186, 115, 0.1)",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            gutterBottom
                            color="#614A29"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1.5,
                            }}
                          >
                            <DescriptionIcon sx={{ color: "#E5BA73" }} />
                            About This Theme
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#614A29",
                              opacity: 0.85,
                              lineHeight: 1.6,
                            }}
                          >
                            {theme.description}
                          </Typography>
                        </Paper>
                      </Fade>
                    )}

                     {/* Packages */}
                     {theme.themePackage && theme.themePackage.length > 0 && (
                      <Fade in={true}>
                        <Box mb={3}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <LocalOfferIcon sx={{ color: "#E5BA73" }} />
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{ color: "#614A29" }}
                            >
                              Available Packages
                            </Typography>
                          </Box>

                          <Stack spacing={2}>
                            {theme.themePackage.map((pkg) => (
                              <Paper
                                key={pkg.id}
                                elevation={0}
                                sx={{
                                  border: selectedPackage?.id === pkg.id 
                                    ? "2px solid #E5BA73" 
                                    : "1px solid #E5BA73",
                                  borderRadius: 2,
                                  p: 2,
                                  background: selectedPackage?.id === pkg.id
                                    ? "rgba(229, 186, 115, 0.1)"
                                    : "rgba(255,255,255,0.7)",
                                  transition: "transform 0.2s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(229, 186, 115, 0.15)",
                                  },
                                  cursor: "pointer"
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPackage(pkg);
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                    sx={{ color: "#866A40" }}
                                  >
                                    {pkg.packageName}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                    sx={{ color: "#E5BA73" }}
                                  >
                                    LKR {pkg.packagePrice.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#614A29", opacity: 0.9 }}
                                >
                                  {pkg.description}
                                </Typography>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      </Fade>
                    )}

                    {/* Select Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTheme(theme);
                      }}
                      disabled={theme.themePackage && theme.themePackage.length > 0 && !selectedPackage}
                      sx={{
                        background:
                          "linear-gradient(135deg, #E5BA73 0%, #D4A85F 100%)",
                        color: "white",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #D4A85F 0%, #C3984E 100%)",
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                          background: "#e0e0e0",
                          color: "#a0a0a0",
                          transform: "none",
                          boxShadow: "none"
                        },
                        borderRadius: 28,
                        py: 1.2,
                        textTransform: "none",
                        boxShadow: "0 4px 14px rgba(229, 186, 115, 0.4)",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        letterSpacing: 0.5,
                        transition: "all 0.3s ease",
                        mt: 1,
                      }}
                    >
                      {theme.themePackage && theme.themePackage.length > 0 && !selectedPackage 
                        ? "Select a Package First" 
                        : "Select This Theme"}
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DisplayEventTheme;