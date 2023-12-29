import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

router.post("/generateImage", async (req, res) => {
  try {
    const { prompt } = req.body;

    const openai = new OpenAI({
      key: process.env.OPENAI_API_KEY,
      // Add any additional configuration options here if needed
    });

    const gptResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    res.json({ imageUrl: gptResponse.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as openAiRouter };
