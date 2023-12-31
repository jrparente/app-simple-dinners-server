import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
});

const instructionStepSchema = new mongoose.Schema({
  step: { type: String, required: true },
});

const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ingredients: [ingredientSchema],
    instructions: [instructionStepSchema],
    imageUrl: { type: String },
    cookingTime: { type: Number },
    categories: [{ type: String }],
    difficulty: { type: String },
    url: { type: String },
    tags: [String],
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const RecipeModel = mongoose.model("recipes", RecipeSchema);
