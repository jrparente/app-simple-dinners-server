import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// Get a specific recipe by ID
router.get("/recipe/:recipeID", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.recipeID);

    if (!recipe) return res.json({ message: "Recipe doesn't exist!" });

    res.json(recipe);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching this recipe." });
  }
});

// Get all recipes
router.get("/:userID", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const response = await RecipeModel.find({
      userOwner: { $in: user._id },
    });

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error ocurred while fetching recipes." });
  }
});

// Create new Recipe
router.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = new RecipeModel({
      ...req.body,
    });

    const response = await recipe.save();
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred while creating a recipe." });
  }
});

// Save a Recipe
router.put("/save", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);

    user.savedRecipes.push(recipe);

    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error ocurred while saving a recipe." });
  }
});

// Unsave a Recipe
router.put("/unsave", verifyToken, async (req, res) => {
  try {
    const recipeID = req.body.recipeID;
    const user = await UserModel.findById(req.body.userID);

    user.savedRecipes = user.savedRecipes.filter(
      (savedRecipe) => !savedRecipe._id.equals(recipeID)
    );

    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred while unsaving a recipe." });
  }
});

// Get Saved Recipes for a user
router.get("/savedRecipes/:userID", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    res.json({ savedRecipes });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred while getting saved recipes." });
  }
});

// Update a Recipe
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipeId = req.body.recipeId;

    const updatedData = {
      ...req.body,
    };

    const updatedRecipe = await RecipeModel.updateOne(
      { _id: recipeId },
      { $set: updatedData }
    );

    if (updatedRecipe.nModified === 0) {
      return res.json({ message: "Recipe doesn't exist!" });
    }

    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the recipe." });
  }
});

// Delete a Recipe
router.delete("/:recipeID", verifyToken, async (req, res) => {
  try {
    const recipeId = req.params.recipeID;

    console.log("Attempting to delete recipe with ID:", recipeId);

    const deletionResult = await RecipeModel.deleteOne({ _id: recipeId });

    if (deletionResult.deletedCount === 0) {
      console.log("Recipe not found.");
      return res.status(404).json({ message: "Recipe not found." });
    }

    console.log("Recipe deleted successfully.");
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the recipe." });
  }
});

export { router as recipesRouter };
