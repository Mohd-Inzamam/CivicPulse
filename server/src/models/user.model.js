import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      lowerCase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    confirmPassword: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      // required: true
    },
    SSN: {
      type: String,
      required: function () {
        return this.role === "user"; // required only for users
      }
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    // ⭐ Nested Admin Fields (kept exactly as written)
    officialDetails: {
      department: { type: String, trim: true },
      employeeId: { type: String, trim: true },
      designation: { type: String, trim: true },
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      city: { type: String, trim: true },
      ward: { type: String, trim: true }
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpires: {
      type: Date
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
  this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10)
  next()
})

userSchema.methods.isPassWordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.isConfirmPassWordCorrect = async function (Confpassword) {
  return await bcrypt.compare(Confpassword, this.confirmPassword)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email
    },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESHTOKEN_SECRET,
    {
      expiresIn: process.env.REFRESHTOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model('User', userSchema)
