const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const authMiddleware = require("../middleware");

const userSchema = zod.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  const { success } = userSchema.safeParse(req.body);
  if (!{ success }) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(411).json({ message: "user exists already" });
  }

  const newData = await User.create({
    username,
    firstName,
    lastName,
    password,
  });
  const userId = newData._id;
  const token = jwt.sign({ userId }, JWT_SECRET);

  res.status(200).json({
    message: "User created successfully",
    token: token,
  });
});

router.post("signin", async (req, res) => {
  const { username, password } = req.body;
  const isValid = User.findOne({ username, password });
  if (isValid) {
    const token = jwt.sign(
      {
        userId: isValid._id,
      },
      JWT_SECRET
    );

    res.status(200).json({ token: token });
  }

  res.status(411).json({ message: "Error logging in" });
});

const updateBody = Zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const success = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json("error updating");
  }
  await User.updateOne({ id: req.userId }, req.body);
  res.json("updated successfully");
});

router.get("/bulk", async (req, res) => {
  const filter = req.params.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      _id: user._id,
    })),
  });
});
module.exports = { router };
