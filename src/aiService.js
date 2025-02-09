import axios from "axios";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
console.log("Using Google Gemini API Key:", API_KEY);

// Function to generate an interview question
export const generateInterviewQuestion = async (jobRole) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate an interview question for a ${jobRole} role.` }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching question:", error.response ? error.response.data : error);
    return "Failed to generate question. Try again.";
  }
};

// Function to generate an AI answer
export const generateAIAnswer = async (question) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Provide a detailed answer to this interview question: ${question}` }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching AI answer:", error.response ? error.response.data : error);
    return "Failed to generate an answer. Try again later.";
  }
};



