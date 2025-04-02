import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import getUserDetails from "../customHooks/extractJwt";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const userDetails = getUserDetails();
  const sub = userDetails?.sub;
  const role = userDetails?.role;

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("role");
    navigate("/"); // Redirect to home page
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderRadius: { md: "0 0 16px 16px" },
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Box
            component="img"
            src="/path-to-festivo-logo.png"
            alt="Festivo Logo"
            sx={{
              height: 45,
              mr: 1,
              filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.1))",
            }}
          />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: "#7D5A50",
                letterSpacing: "0.5px",
              }}
            >
              Festivo
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#B4846C",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginTop: "-5px",
              }}
            >
              Event Planner
            </Typography>
          </Box>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="primary"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Home</MenuItem>
              <MenuItem onClick={handleMenuClose}>Order Items</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              sx={{
                mx: 1,
                color: "#7D5A50",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "rgba(125, 90, 80, 0.08)",
                },
              }}
            >
              Home
            </Button>
            <Button
              sx={{
                mx: 1,
                color: "#7D5A50",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "rgba(125, 90, 80, 0.08)",
                },
              }}
            >
              Order Items
            </Button>
            <IconButton
              aria-label="shopping cart"
              sx={{
                mx: 2,
                color: "#7D5A50",
                "&:hover": {
                  bgcolor: "rgba(125, 90, 80, 0.08)",
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(125, 90, 80, 0.04)",
                py: 0.5,
                px: 1.5,
                borderRadius: 4,
              }}
            >
              <Avatar
                src="/path-to-user-image.jpg"
                alt="User"
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid #E6CCB2",
                }}
              />
              {sub != null && role == "ADMIN" ? (
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    color: "#7D5A50",
                    fontWeight: 500,
                  }}
                >
                  <Button onClick={handleLogout}>{sub}</Button>
                  <Link to="/admin/dashboard">
                    <Button
                      sx={{
                        color: "black",
                      }}
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                </Typography>
              ) : sub != null ? (
                <Button onClick={handleLogout}>{sub}</Button>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    color: "#7D5A50",
                    fontWeight: 500,
                  }}
                >
                  <Link to="/login">
                    <Button
                      sx={{
                        color: "black",
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
