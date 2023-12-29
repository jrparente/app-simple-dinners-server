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
    });

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/generateRecipeInstructions", async (req, res) => {
  try {
    const { prompt } = req.body;

    const openai = new OpenAI({
      key: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are an expert chef providing detailed recipe instructions. You provide step-by-step instructions in a JSON format, as follows: ["Mix ingredients together", "Bake at 350 degrees for 30 minutes", ...]',
        },
        {
          role: "user",
          content: `Generate recipe instructions for ${prompt}.`,
        },
      ],
      temperature: 1,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.json({ recipeInstructions: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating recipe instructions:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export { router as openAiRouter };
