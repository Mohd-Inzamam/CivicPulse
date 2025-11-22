export const verifyEmailTemplate = (name, verifyLink) => `
  <h2>Verify your email</h2>
  <p>Hello ${name},</p>
  <p>Thanks for registering on <strong>CivicPulse</strong>.</p>
  <p>Please verify your email by clicking below:</p>
  <a href="${verifyLink}" target="_blank">Verify Email</a>
  <p>If you didn’t sign up, just ignore this email.</p>
`;

export const resendVerificationTemplate = (name, verifyLink) => `
  <h2>Verify your email</h2>
  <p>Hello ${name || ""},</p>
  <p>Thank you for registering on <strong>CivicPulse</strong>.</p>
  <p>Please click below to verify your email:</p>
  <a href="${verifyLink}" target="_blank">Verify Email</a>
  <p>If you did not request this, you can safely ignore this email.</p>
`;

export const forgotPasswordTemplate = (name, resetLink) => `
  <h2>Reset your password</h2>
  <p>Hello ${name},</p>
  <p>We received a request to reset your password.</p>
  <p>Click below to reset it:</p>
  <a href="${resetLink}" target="_blank">Reset Password</a>
  <p>This link will expire in 10 minutes.</p>
  <p>If you didn't request this, simply ignore this email.</p>
`;

export const resetSuccessTemplate = (name) => `
  <h2>Password Updated</h2>
  <p>Hello ${name},</p>
  <p>Your password has been successfully reset.</p>
  <p>If you didn't perform this action, change your password immediately.</p>
`;
