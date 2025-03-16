// services/aiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyCnwX_uqmi4BnkFPUBj4EtscU9IaaNH5NI");

const medical_chatbot = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Add context management if needed
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a professional medical assistant. Only answer medical-related questions. If a non-medical question is asked, respond with 'I can only assist with medical-related queries.'"
}]
        }
      ]
    });

    const result = await chat.sendMessage(userInput);
    return result.response.text();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to process medical query');
  }
};
module.exports = { medical_chatbot };