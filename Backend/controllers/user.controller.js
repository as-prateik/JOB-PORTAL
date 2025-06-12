const User = require("../models/user.model");
const path = require("path");
const fs = require("fs");

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const authId = req.user.userId;
    const user = await User.findOne({ authId }).select("-__v");
    // console.log("user is ",user);
    if (!user)
      return res.status(404).json({ message: "User profile not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProfileByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params
    const user = await User.findOne({ employeeId: Number(employeeId) }).select("-__v");
    if (!user)
      return res.status(404).json({ message: "User profile not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile fields (name, email, phone, skills, certifications)
exports.updateProfile = async (req, res) => {
  try {
    // console.log("in updateProfile in backend");
    const authId = req.user.userId;
    const updateData = { ...req.body };
    if ("employeeId" in updateData) {
      delete updateData.employeeId;
    }
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") delete updateData[key];
    });
    // Only HR can update name and email
    if (req.user.role !== "hr") {
      delete updateData.name;
      delete updateData.email;
    }
    // console.log("Update data:", updateData);
    const user = await User.findOneAndUpdate({ authId }, updateData, {
      new: true,
    });
    // console.log("User after update:", user);
    if (!user)
      return res.status(404).json({ message: "User profile not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfileByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = { ...req.body };
    if (req.user.role !== "hr") {
      delete updateData.name;
      delete updateData.email;
    }
    const user = await User.findOneAndUpdate(
      { employeeId: Number(employeeId) },
      updateData,
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "User profile not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    // console.log("Files received:", req.files);
    const authId = req.user.userId;
    const user = await User.findOne({ authId });
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    // Helper to delete old file if it exists
    const deleteOldFile = (fileUrl) => {
      if (fileUrl) {
        const filePath = path.resolve(__dirname, "..", "..", fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    };
    // Update URLs for uploaded files if present
    if (req.files) {
      if (req.files.profilePhoto) {
        // Delete old profile photo
        deleteOldFile(user.profilePhotoUrl);
        user.profilePhotoUrl = `/uploads/photos/${req.files.profilePhoto[0].filename}`;
      }
      if (req.files.resume) {
        // Delete old resume
        deleteOldFile(user.resumeUrl);
        user.resumeUrl = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
      if (req.files.coverLetter) {
        // Delete old cover letter
        deleteOldFile(user.coverLetterUrl);
        user.coverLetterUrl = `/uploads/coverletters/${req.files.coverLetter[0].filename}`;
      }
    }
    await user.save();
    res.json({ message: "Files uploaded successfully", user });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getEmployeeApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find the user and populate appliedJobs with job details
    const user = await User.findOne({ authId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ appliedJobs: user.appliedJobs });
  } catch (error) {
    console.error("Error fetching employee applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getEmployeesByManager = async (req, res) => {
  const { managerId } = req.params;

  try {
    const employees = await User.find({ reportsTo: managerId }).select(
  'name email location role skills certifications resumeUrl'
);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

