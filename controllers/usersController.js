const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles, score } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd, roles };

  if (score !== undefined) {
    userObject.score = score; // Add score if defined
  }

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password, score } = req.body;

  // Confirm that the ID is provided
  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  // Find the user by ID
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // If username is being updated, check for duplicates
  if (username && username !== user.username) {
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate username." });
    }
    user.username = username;
  }

  // Update roles if provided
  if (roles) {
    if (!Array.isArray(roles) || roles.length === 0) {
      return res
        .status(400)
        .json({ message: "Roles must be a non-empty array." });
    }
    user.roles = roles;
  }

  // Update active status if provided
  if (active !== undefined) {
    if (typeof active !== "boolean") {
      return res.status(400).json({ message: "Active must be a boolean." });
    }
    user.active = active;
  }

  // Update score if provided
  if (score !== undefined) {
    if (typeof score !== "number") {
      return res.status(400).json({ message: "Score must be a number." });
    }
    user.score = score;
  }

  // Update password if provided
  if (password) {
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
    user.password = hashedPwd;
  }

  // Save the updated user
  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated successfully.` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
