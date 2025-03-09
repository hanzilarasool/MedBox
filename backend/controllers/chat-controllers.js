// controllers/chatController.js
const { medical_chatbot } = require('./services/aiService');

const generateMedicalResponse = async (req, res) => {
  try {
    const response = await medical_chatbot(req.body.message);
    res.json({ 
      response: response.replace(/\*\*/g, '') // Remove bold formatting
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};
module.exports={generateMedicalResponse};