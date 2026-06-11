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

export const statusUpdateTemplate = (reporterName, issueTitle, oldStatus, newStatus, issueId, appUrl) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 28px 32px;">
      <h1 style="color: white; margin: 0; font-size: 22px;">🏛️ CivicPulse</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Your issue has been updated</p>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Hi <strong>${reporterName}</strong>,</p>
      <p style="color: #374151; font-size: 15px; margin: 0 0 24px;">
        Your reported issue has a status update from the authorities.
      </p>
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 12px; font-weight: 600; color: #111827; font-size: 15px;">${issueTitle}</p>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${oldStatus}</span>
          <span style="color: #6b7280; font-size: 18px;">→</span>
          <span style="background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${newStatus}</span>
        </div>
      </div>
      ${newStatus === 'Resolved' ? `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #15803d; font-size: 14px;">
            🎉 <strong>Great news!</strong> Your issue has been resolved. Thank you for helping improve your community.
          </p>
        </div>
      ` : ''}
      <a href="${appUrl}/issues/${issueId}"
        style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        View Issue →
      </a>
      <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
        You received this because you reported this issue on CivicPulse.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const watcherStatusUpdateTemplate = (watcherName, issueTitle, newStatus, issueId, appUrl) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 28px 32px;">
      <h1 style="color: white; margin: 0; font-size: 22px;">🏛️ CivicPulse</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Issue you're watching was updated</p>
    </div>
    <div style="padding: 32px;">
      <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Hi <strong>${watcherName}</strong>,</p>
      <p style="color: #374151; font-size: 15px; margin: 0 0 24px;">
        An issue you're watching has a new status: <strong>${newStatus}</strong>
      </p>
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-weight: 600; color: #111827;">${issueTitle}</p>
      </div>
      <a href="${appUrl}/issues/${issueId}"
        style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        View Issue →
      </a>
    </div>
  </div>
</body>
</html>
`;