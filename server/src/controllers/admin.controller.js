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

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
        throw new apiError(
            400,
            "Full Name, Email, Password, and Confirm Password are required"
        );
    }

    if (password !== confirmPassword) {
        throw new apiError(400, "Passwords do not match");
    }

    // Check if admin already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new apiError(409, "Admin with this email already exists");
    }

    // Upload avatar (optional)
    let avatarUrl = "https://via.placeholder.com/150";
    if (req.file?.path) {
        const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "civicpulse/admins",
        });
        avatarUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create admin user
    const admin = await User.create({
        fullName: fullName.toLowerCase(),
        email,
        password,
        confirmPassword,
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
        // do not throw — registration should still work
    }

    return res
        .status(200)
        .json(
            new apiResponce(
                201,
                admin,
                "Admin registered successfully. Please verify your email."
            )
        );
});

//   LOGIN ADMIN
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(400, "Email and Password are required");
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
        throw new apiError(404, "Admin not found or not registered");
    }

    // Check password
    const isPasswordValid = await admin.isPassWordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid credentials");
    }

    // Generate tokens
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save refresh token
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponce(200, "Admin logged in successfully", {
            accessToken,
            refreshToken,
            admin,
        })
    );
});
