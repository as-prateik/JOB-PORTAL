const bcrypt = require("bcrypt");

const Auth = require("../models/auth.model");

const User = require("../models/user.model");

const registerUser = async (req, res) => {


 

  try {

    const {

      username,

      password,

      role,

      name,

      email,

      phone,

      skills,

      certifications,

    } = req.body;

    if (!username || !password || !role) {

      return res.status(400).json({ message: "Username, password, and role are required" });

    }

    // Check if user exists

    const existingUser = await Auth.findOne({ username });

    if (existingUser)

      return res.status(400).json({ message: "Username already exists" });

    // Hash the password

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Auth collection

    const newUser = new Auth({ username, password: hashedPassword, role });

    await newUser.save();

    // Auto-generate email if not provided

    const userEmail =

      email && email.trim() !== "" ? email : `${username}@infosys.com`;

    // Auto-generate employee ID

    const lastUser = await User.findOne().sort({ employeeId: -1 });

    const nextEmployeeId =

      lastUser && lastUser.employeeId ? lastUser.employeeId + 1 : 1001;

    // Create user profile in User collection

    const userProfile = new User({

      authId: newUser._id,

      name: name || username,

      employeeId: nextEmployeeId,

      role: role || "employee",

      email: userEmail,

      phone: phone || "",

      skills: skills || [],

      certifications: certifications || [],

    });

    await userProfile.save();

    // console.log("User profile created:", userProfile);

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: "Registration failed" });

  }

};

const jwt = require("jsonwebtoken");


 

const loginUser = async (req, res) => {

  const { username, password } = req.body;

  try {

    const user = await Auth.findOne({ username });

    if (!user) {

      return res.status(401).json({ message: "Invalid credentials" });

    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(401).json({ message: "Invalid credentials" });

    }


 

    // Fetch the corresponding User document to get employeeId and name

    const userProfile = await User.findOne({ authId: user._id }); // 'user' here is the Auth document

    if (!userProfile) {

        // This case should ideally not happen if registration ensures both docs are created

        // and data integrity is maintained.

        console.error(`User profile not found for authId: ${user._id}`);

        return res.status(500).json({ message: "User profile not found. Please contact support." });

    }


 

    // Generate JWT

    console.log("user is ", user);

    const tokenPayload = {

      id: user._id,       // This is Auth._id, often used as userId internally

      role: user.role,

      employeeId: userProfile.employeeId, // Add employeeId here

      username:userProfile.username

    };

    console.log("JWT Payload:", tokenPayload); // For debugging


 

    const token = jwt.sign(

      tokenPayload,

      process.env.JWT_SECRET,

      { expiresIn: "1d" }

    );

   

    // console.log("user is ",user);

    res.json({ token, username: user.username, role: user.role , name: userProfile.name }); // Use name from User model

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

const changePassword = async (req, res) => {

  try {

    const userId = req.user.userId; // Populated from JWT middleware

    const { oldPassword, newPassword } = req.body;

    // 1. Fetch user

    const user = await Auth.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Compare old password

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch)

      return res.status(401).json({ message: "Incorrect old password" });

    // 3. Hash new password

    const hashed = await bcrypt.hash(newPassword, 10);

    // 4. Update

    user.password = hashed;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {

    console.error("Error in changePassword:", err);

    res.status(500).json({ message: "Server error" });

  }

};



 

module.exports = {

  registerUser,

  loginUser,

  changePassword,

};


 