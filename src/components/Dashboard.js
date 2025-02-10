import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import { Container, Button, Typography, Stack, IconButton, CircularProgress } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// ✅ Use motion(Button) to animate MUI Buttons
const MotionButton = motion(Button);

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    alert("Logged out!");
    navigate("/login");
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Dashboard!
        </Typography>

        {/* Dark Mode Toggle Button */}
        <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ mb: 2 }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Stack spacing={2} direction="column">
          {/* ✅ Fixed: Use `motion(Button)` instead of `<motion.button>` */}
          <MotionButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/question-generator")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            Generate Interview Questions
          </MotionButton>

          <MotionButton
            variant="contained"
            color="secondary"
            onClick={() => navigate("/saved-questions")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            View Saved Questions
          </MotionButton>

          <MotionButton
            variant="outlined"
            color="error"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            Logout
          </MotionButton>
        </Stack>
      </Container>
    </motion.div>
  );
};

export default Dashboard;