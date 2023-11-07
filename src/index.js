import express from "express";
import cors from "cors";

import { connectDB } from "./connectDB.js";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

app.get("/", (req, res) => {
  res.json("Hello my new server");
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
