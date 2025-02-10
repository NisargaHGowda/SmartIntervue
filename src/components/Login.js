import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Link,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const MotionButton = motion(Button); // ✅ Use motion for MUI Buttons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
          <LockOpenIcon sx={{ fontSize: 50, color: "#1976d2", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* ✅ Fixed: Use `motion(Button)` instead of `<motion.button>` */}
            <MotionButton
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              Login
            </MotionButton>

            <Link
              component="button"
              variant="body2"
              sx={{ textAlign: "right" }}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </Link>
          </Box>

          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* ✅ Fixed Google Login Button */}
          <MotionButton
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            Login with Google
          </MotionButton>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default Login;

