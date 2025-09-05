import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Save new user
 */
export function saveUser(req, res) {
  if (req.body.role == "admin") {
    if (req.user == null) {
      res.status(400).json({
        message: "Please login as an admin to create a user",
      });
      return;
    }

    if (req.user.role != "admin") {
      res.status(400).json({
        message: "You are not authorized to create a new admin account",
      });
      return;
    }
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  console.log(hashedPassword);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    phone: req.body.phone,
    Height: req.body.Height,
    Weight: req.body.Weight,
    dob: req.body.dob,
  });

  user
    .save()
    .then(() => {
      res.status(201).json({
        message: "User saved sucessfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error saving user",
        error: err.message,
      });
    });
}

/**
 * Normal login (email + password)
 */
export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (user == null) {
      res.json({
        message: "User not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const userData = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          Height: user.Height,
          Weight: user.Weight,
          dob: user.dob,
          profilePicture: user.profilePicture,
          point: user.point,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };
        const token = jwt.sign(userData, process.env.JWT_KEY);
        res.json({
          message: "Login successful",
          token: token,
          user: userData,
        });
      } else {
        res.json({
          message: "Incorrect password",
        });
      }
    }
  });
}

/**
 * Google login
 */
export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const p = ticket.getPayload();
    if (!p?.email) return res.status(400).json({ message: "Email not available from Google" });

    // ---- Name normalization (robust) ----
    const splitName = (full) => {
      if (!full) return { first: "User", last: "Account" };
      const parts = full.trim().replace(/\s+/g, " ").split(" ");
      if (parts.length === 1) return { first: parts[0], last: "" };
      return { first: parts[0], last: parts.slice(1).join(" ") };
    };

    const firstLast =
      p.given_name || p.family_name
        ? { first: (p.given_name || "").trim() || splitName(p.name).first,
            last:  (p.family_name || "").trim() || splitName(p.name).last }
        : splitName(p.name);

    const googleId = p.sub;
    const picture  = p.picture;
    const email    = p.email;
    const verified = !!p.email_verified;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = bcrypt.hashSync("google_login_" + googleId + "_" + Date.now(), 10);
      user = await User.create({
        email,
        firstName: firstLast.first,
        lastName:  firstLast.last,
        password: randomPassword,
        phone: "Not given",
        height: "Not given",
        weight: "Not given",
        dob: Date.now(),
        isEmailVerified: verified || true,
        // if your schema has these optional fields:
        googleId,
        avatar: picture,
      });
    } else {
      let changed = false;
      // If names are blank or placeholders, fill them from Google
      if (!user.firstName || user.firstName === "User") { user.firstName = firstLast.first; changed = true; }
      if ((user.lastName ?? "") === "" || user.lastName === "Account") { user.lastName = firstLast.last; changed = true; }
      if (!user.isEmailVerified && verified) { user.isEmailVerified = true; changed = true; }
      if (!user.googleId && googleId) { user.googleId = googleId; changed = true; }
      if (!user.avatar && picture) { user.avatar = picture; changed = true; }
      if (changed) await user.save();
    }

    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      Height: user.Height,
      Weight: user.Weight,
      dob: user.dob,
      profilePicture: user.profilePicture,
      point: user.point,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isDisabled: user.isDisabled,
      isEmailVerified: user.isEmailVerified,
    };

    const token = jwt.sign(userData, process.env.JWT_KEY);
    return res.json({ message: "Login successful", token, user: userData });
  } catch (err) {
    console.error("Google login error", err);
    return res.status(401).json({ message: "Invalid Google credential" });
  }
}

/**
 * Get all users
 */
export function getAllUsers(req, res) {
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "Users fetched successfully",
        users: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error fetching users",
        error: err.message,
      });
    });
}

/**
 * Get user by ID
 */
export async function getUserById(req, res) {
  const userId = req.params.id;
  const user = await User.findOne({ userId: userId });
  if (user == null) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }
  res.json({
    user: user,
  });
}

/**
 * Update user
 */
export function updateUser(req, res) {
  User.findOneAndUpdate(
    {
      userId: req.params.id,
    },
    req.body
  )
    .then((user) => {
      if (user == null) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json({
          message: "User updated successfully",
          user: user,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error updating user",
        error: err.message,
      });
    });
}

/**
 * Delete user
 */
export function deleteUser(req, res) {
  if (req.user == null) {
    res.status(400).json({
      message: "Please login to delete a user",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(400).json({
      message: "You are not authorized to delete a user",
    });
    return;
  }

  User.findOneAndDelete({
    userId: req.params.id,
  })
    .then((user) => {
      if (user == null) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json({
          message: "User deleted successfully",
          user: user,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting user",
        error: err.message,
      });
    });
}

/**
 * Update role
 */
export function updateUserRole(req, res) {
  if (req.user == null) {
    res.status(400).json({
      message: "Please login to update user role",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(400).json({
      message: "You are not authorized to update user role",
    });
    return;
  }

  User.findOneAndUpdate(
    { userId: req.params.id },
    { role: req.body.role },
    { new: true }
  )
    .then((user) => {
      if (user == null) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json({
          message: "User role updated successfully",
          user: user,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error updating user role",
        error: err.message,
      });
    });
}
