import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "cloudinary";
import fs from "fs";
import { transporter } from "../utils/email/mailTransporter.js";
import { verifyEmailTemplate } from "../utils/email/EmailTemplates.js";
import crypto from "crypto";

// REGISTER ADMIN
export const registerAdmin = asyncHandler(async (req, res) => {

    const {
        fullName,
        email,
        password,
        confirmPassword,
        department,
        employeeId,
        designation,
        state,
        district,
        city,
        ward,
    } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
        throw new apiError(400, "Full Name, Email, Password, and Confirm Password are required");
    }

    if (password !== confirmPassword) {
        throw new apiError(400, "Passwords do not match");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new apiError(409, "Admin with this email already exists");
    }

    // Default avatar
    // let avatarUrl = "https://via.placeholder.com/150";

    let avatarUrl = "https://via.placeholder.com/150";
    if (req.file?.path) {
        const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "civicpulse/admins",
        });
        avatarUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const admin = await User.create({
        fullName: fullName.toLowerCase(),
        email,
        password,
        confirmPassword, // will be hashed by pre-save middleware
        avatar: avatarUrl,
        role: "admin",
        officialDetails: {
            department,
            employeeId,
            designation,
            state,
            district,
            city,
            ward,
        },
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
    });

    try {
        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
        const verifyLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Verify your CivicPulse Admin account",
            html: verifyEmailTemplate(fullName, verifyLink),
        });

    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
    }

    const safeAdminData = await User.findById(admin._id)
        .select("-password -confirmPassword -refreshToken");

    return res.status(201).json(
        new apiResponce(201, safeAdminData, "Admin registered successfully. Please verify your email.")
    );
});

//   LOGIN ADMIN
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const isProd = process.env.NODE_ENV === "production";

    if (!email || !password) {
        throw new apiError(400, "Email and Password are required");
    }

    // Ensure only admins can login via this route
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
        throw new apiError(404, "Admin not found or Not an Admin");
    }

    const isPasswordValid = await admin.isPassWordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid credentials");
    }

    if (!admin.isEmailVerified) {
        throw new apiError(400, "Please verify your email before logging in");
    }

    // Generate new tokens
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save refresh token in DB
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    // Remove sensitive data
    const safeAdmin = await User.findById(admin._id)
        .select("-password -confirmPassword -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new apiResponce(
                200,
                {
                    admin: safeAdmin,
                    accessToken,
                },
                "Admin logged in successfully"
            )
        );
});

// ==============================
// DISABLE / ENABLE USER
// ==============================
export const toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new apiError(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found");
    }

    // Prevent admin from disabling themselves
    if (user.role === "admin") {
        throw new apiError(403, "Cannot disable another admin");
    }

    // Toggle isActive status
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponce(
            200,
            { userId: user._id, isActive: user.isActive },
            `User has been ${user.isActive ? "enabled" : "disabled"} successfully`
        )
    );
});
