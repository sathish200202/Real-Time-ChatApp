import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

//signup Controller
export const Signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    //if any fields are empty handle it
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //if check the enetered password atleast 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    //chrck the user already exists or not
    const existinguser = await User.findOne({ email });

    if (existinguser)
      return res.status(400).json({ message: "Email already exists" });

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,

        message: "New User created successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//login Controller
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //if the user in not get
    if (!user) {
      return res.status(400).json({ message: "Invalid Crendenials" });
    }

    //compare the entered password to user password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //generate the token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "Login successfully",
    });
  } catch (error) {
    console.log("Error in logi controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//logout Controller
export const Logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//update profile Controller
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is required" });
    }

    //upload the image to cloudinary buget
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    //update the profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    await updatedUser.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update Profile controller ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//get check auth controller
export const checkAuth = (req, res) => {
  try {
    //send the user to the client
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
