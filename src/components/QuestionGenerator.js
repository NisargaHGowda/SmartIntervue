import React, { useState } from "react";
import { generateInterviewQuestion } from "../aiService";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

const QuestionGenerator = () => {
  const [jobRole, setJobRole] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestion = async () => {
    if (!jobRole.trim()) {
      alert("Please enter a job role.");
      return;
    }

    setLoading(true);
    const generatedQuestion = await generateInterviewQuestion(jobRole);
    setQuestion(generatedQuestion);
    setLoading(false);

    if (auth.currentUser) {
      await addDoc(collection(db, "questions"), {
        userId: auth.currentUser.uid,
        jobRole,
        question: generatedQuestion,
        createdAt: serverTimestamp(),
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Smart Interview Question Generator
        </Typography>

        <TextField
          label="Enter Job Role (e.g., Frontend Developer)"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerateQuestion}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Question"}
        </Button>

        {question && (
          <Paper elevation={2} sx={{ p: 3, mt: 3, textAlign: "left" }}>
            <Typography variant="h6">Generated Question:</Typography>
            <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
              {question}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default QuestionGenerator;
