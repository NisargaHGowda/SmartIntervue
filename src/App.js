import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import QuestionGenerator from "./components/QuestionGenerator";
import PrivateRoute from "./components/PrivateRoute";
import SavedQuestions from "./components/SavedQuestions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/question-generator" element={<PrivateRoute><QuestionGenerator /></PrivateRoute>} />
      <Route path="/saved-questions" element={<PrivateRoute><SavedQuestions /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
