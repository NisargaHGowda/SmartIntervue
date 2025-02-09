import React, { useContext } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext"; // Import Theme Context
import { Container, Button, Typography, Stack, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleLogout = async () => {
    await auth.signOut();
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard!
      </Typography>

      {/* Dark Mode Toggle Button */}
      <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ mb: 2 }}>
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <Stack spacing={2} direction="column">
        <Button variant="contained" color="primary" onClick={() => navigate("/question-generator")}>
          Generate Interview Questions
        </Button>

        <Button variant="contained" color="secondary" onClick={() => navigate("/saved-questions")}>
          View Saved Questions
        </Button>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>
    </Container>
  );
};

export default Dashboard;

