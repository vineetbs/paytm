const mongoose = require("mongoose");
const express = require("express");
const { number } = require("zod");

mongoose
  .connect("mongodb+srv://vineet:vineet123@cluster0.t0w7x.mongodb.net/")
  .then(console.log("db connected"));

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const balanceSchema = mongoose.Schema({
  userId: {
    type: Schema.types.ObjectId,
    ref: User,
    required: true,
  },
  balance: {
    type: number,
    required: true,
  },
});

const Accounts = mongoose.model("accounts", balanceSchema);
const User = mongoose.model("user", userSchema);
module.exports = { User, Accounts };
