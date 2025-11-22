import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponce } from "../utils/apiResponce.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { transporter } from "../utils/email/mailTransporter.js";
import {
  verifyEmailTemplate, resendVerificationTemplate, forgotPasswordTemplate, resetSuccessTemplate
} from '../utils/email/EmailTemplates.js'
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";


const generateAccessAndRefreshToken = async (UserID) => {
  try {
    const user = await User.findById(UserID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw apiError(500, "Token Generate Failed");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword, role, ssn } = req.body;

  if (!fullName || !email || !password || !confirmPassword) {
    throw new apiError(400, "All required fields are missing");
  }

  if (password !== confirmPassword) {
    throw new apiError(400, "Passwords do not match");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { SSN: ssn }] });

  if (existingUser) {
    throw new apiError(400, "User already exists with this email or SSN");
  }

  // AVATAR UPLOAD
  let avatarURL = "https://via.placeholder.com/150";

  if (req.files?.avatar?.[0]) {
    const localFilePath = req.files.avatar[0].path;

    const uploaded = await uploadOnCloudinary(localFilePath);
    if (!uploaded) throw new apiError(400, "Avatar upload failed");

    avatarURL = uploaded.url;
  }

  // CREATE EMAIL VERIFICATION TOKEN
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // CREATE USER
  const user = await User.create({
    fullName: fullName.toLowerCase(),
    email,
    password: password,
    confirmPassword: confirmPassword,
    SSN: ssn,
    avatar: avatarURL,
    role: role || "user",
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -confirmPassword -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while creating the user");
  }

  // SEND VERIFICATION EMAIL

  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

    const verifyLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Verify your CivicPulse account",
      html: verifyEmailTemplate(fullName, verifyLink),
    });

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // Don't throw — registration should NOT fail due to email failure
  }

  // RESPONSE
  return res.status(201).json(
    new apiResponce(
      201,
      createdUser,
      "User registered successfully. Please verify your email."
    )
  );
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password, role, rememberMe } = req.body;
  const isProd = process.env.NODE_ENV === "production";

  if (!(email && password)) {
    throw new apiError(400, "Email and password are required");
  }


  const user = await User.findOne({ email });
  if (role && user.role !== role) {
    throw new apiError(403, "Incorrect role for login");
  }

  if (!user) {
    throw new apiError(400, "Invalid credentials");
  }

  const isPasswordValid = await user.isPassWordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(400, "Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new apiError(400, "Please verify your email before logging in");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -confirmPassword -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponce(
        200,
        { user: loggedInUser, accessToken },
        "Login successful"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponce(200, {}, "Logout successful"));
});

const refAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  const isProd = process.env.NODE_ENV === "production";

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESHTOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponce(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, "Invalid refresh token");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Reset your CivicPulse password",
      html: forgotPasswordTemplate(user.fullName, resetLink),
    });
  } catch (error) {
    console.error("Email send failed:", error.message);
  }

  return res
    .status(200)
    .json(new apiResponce(200, {}, "Password reset link sent to your email"));
});

const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new apiError(400, "Reset token is required");
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, "Invalid or expired reset token");
  }

  return res.status(200).json(new apiResponce(200, {}, "Reset token is valid"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!(token && password)) {
    throw new apiError(400, "Token and password are required");
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.confirmPassword = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json(new apiResponce(200, {}, "Password reset successful"));
});
// ✅ VERIFY EMAIL
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new apiError(400, "Verification token is required");
  }

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new apiError(400, "Invalid verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  return res
    .status(200)
    .json(new apiResponce(200, {}, "Email verified successfully"));
});

// ✅ RESEND VERIFICATION EMAIL
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new apiError(400, "Email is already verified");
  }

  // 🔹 Generate fresh verification token
  const newToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = newToken;

  await user.save({ validateBeforeSave: false });

  // 🔹 Build frontend verify link (same logic as register)
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const verifyLink = `${FRONTEND_URL}/verify-email?token=${newToken}`;

  try {
    // 🔹 Use imported template
    const htmlContent = resendVerificationTemplate({
      name: user.fullName || "",
      link: verifyLink,
    });

    // 🔹 Send email using global transporter
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Verify your CivicPulse account",
      html: htmlContent,
    });

    return res
      .status(200)
      .json(
        new apiResponce(
          200,
          {},
          "Verification email sent successfully. Please check your inbox."
        )
      );
  } catch (error) {
    console.error("❌ Resend verification error:", error.message);
    throw new apiError(500, "Failed to send verification email");
  }
});

const verifyToken = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Access token is required");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -confirmPassword -refreshToken"
    );

    if (!user) {
      throw new apiError(401, "Invalid access token");
    }

    return res
      .status(200)
      .json(new apiResponce(200, { user }, "Token is valid"));
  } catch (error) {
    throw new apiError(401, "Invalid access token");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!(oldPassword && newPassword && confirmNewPassword)) {
    throw new apiError(400, "All password fields are required");
  }

  if (newPassword !== confirmNewPassword) {
    throw new apiError(400, "New passwords do not match");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPassWordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new apiResponce(200, {}, "Password updated successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email, ssn } = req.body;

  // require at least one field
  if (!(name || email || ssn)) {
    throw new apiError(400, "At least one field (name, email or ssn) is required");
  }

  const updateObj = {};
  if (name) updateObj.fullName = name.toLowerCase();
  if (email) updateObj.email = email;
  if (ssn) updateObj.SSN = ssn;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateObj },
    { new: true, runValidators: true }
  ).select("-password -confirmPassword -refreshToken");

  return res.status(200).json(new apiResponce(200, { user }, "Account updated successfully"));
});


const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new apiError(400, "No avatar file provided");
  }

  // Upload new image
  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

  if (!cloudinaryResponse?.secure_url) {
    throw new apiError(500, "Avatar upload failed");
  }

  // Delete temp file after upload
  fs.unlink(req.file.path, () => { });

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: cloudinaryResponse.secure_url,
      },
    },
    { new: true }
  ).select("-password -confirmPassword -refreshToken");

  return res
    .status(200)
    .json(
      new apiResponce(
        200,
        { user: updatedUser },
        "Avatar updated successfully"
      )
    );
});

export {
  registerUser,
  LoginUser,
  logOutUser,
  refAccessToken,
  updatePassword,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyEmail,
  resendVerification,
  verifyToken,
  updateAvatar
};
