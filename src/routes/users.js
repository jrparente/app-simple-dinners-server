import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error) => {
      if (error) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/:userID", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);

    if (!user) {
      return res.json({ message: "User doesn't exist!" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred while fetching the user." });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username: username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully!" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username: username });

  if (!user) {
    return res.json({ message: "User doesn't exist!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Password is incorrect!" });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.SECRET_KEY
  );

  res.json({ token, userID: user._id });
});

export { router as userRouter };
