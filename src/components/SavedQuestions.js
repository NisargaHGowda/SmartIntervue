import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import emailjs from "emailjs-com"; // Email Sending
import jsPDF from "jspdf"; // PDF Download

const SERVICE_ID = "your_service_id"; // Replace with EmailJS Service ID
const TEMPLATE_ID = "your_template_id"; // Replace with EmailJS Template ID
const USER_ID = "your_user_id"; // Replace with EmailJS User ID

const SavedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "questions"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const savedQuestions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(savedQuestions);
        setFilteredQuestions(savedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredQuestions(
        questions.filter((q) =>
          q.jobRole.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredQuestions(questions);
    }
  }, [search, questions]);

  // Function to Send Email
  const sendEmail = async () => {
    if (!auth.currentUser) return;
    
    setEmailSending(true);

    const questionsList = filteredQuestions
      .map((q, index) => `${index + 1}. ${q.question}`)
      .join("\n\n");

    const emailData = {
      user_name: auth.currentUser.email,
      user_email: auth.currentUser.email,
      questions_list: questionsList,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, USER_ID);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }

    setEmailSending(false);
  };

  // Function to Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Saved Interview Questions", 10, 10);

    filteredQuestions.forEach((q, index) => {
      doc.text(`${index + 1}. ${q.question}`, 10, 20 + index * 10);
    });

    doc.save("Interview_Questions.pdf");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Saved Interview Questions
        </Typography>

        <TextField
          label="Search by Job Role"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <CircularProgress />
        ) : filteredQuestions.length > 0 ? (
          <Paper elevation={2} sx={{ p: 2 }}>
            <List>
              {filteredQuestions.map((q) => (
                <ListItem key={q.id} divider>
                  <ListItemText
                    primary={q.question}
                    secondary={`Role: ${q.jobRole} | Date: ${new Date(q.createdAt?.seconds * 1000).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={sendEmail}
                disabled={emailSending}
              >
                {emailSending ? "Sending..." : "Send to Email"}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={downloadPDF}
              >
                Download as PDF
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Typography variant="h6">No questions found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SavedQuestions;
