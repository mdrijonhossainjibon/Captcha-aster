import nodemailer from 'nodemailer'
import { SmtpSetting } from './models/SmtpSetting'
import connectDB from './mongodb'

interface SendOTPEmailParams {
  email: string
  otp: string
  name?: string
}

// Dynamic transporter creator
const getTransporter = async () => {
  await connectDB()
  const dbSettings = await SmtpSetting.findOne({ isActive: true })

  if (dbSettings) {
    return nodemailer.createTransport({
      host: dbSettings.host,
      port: dbSettings.port,
      secure: dbSettings.secure,
      auth: {
        user: dbSettings.user,
        pass: dbSettings.pass,
      },
    })
  }

  // Fallback to environment variables
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const getFromEmail = async () => {
  const dbSettings = await SmtpSetting.findOne({ isActive: true })
  if (dbSettings?.from) return dbSettings.from
  return process.env.SMTP_FROM || process.env.SMTP_USER
}

export async function sendOTPEmail({ email, otp, name }: SendOTPEmailParams): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    const fromEmail = await getFromEmail()

    // In development without SMTP, just log the OTP
    if (!transporter) {
      console.log('📧 [DEV MODE] OTP Email for', email, ':', otp)
      console.log('⚠️  Configure SMTP settings in .env.local for production')
      return true
    }

    const mailOptions = {
      from: `"CaptchaⱮaster" <${fromEmail}>`,
      to: email,
      subject: 'Your Login Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                          Captcha<span style="color: #6366f1;">Ɱaster</span>
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          ${name ? `Hi ${name},` : 'Hello,'}
                        </p>
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Your verification code for logging into CaptchaⱮaster is:
                        </p>
                        
                        <!-- OTP Code -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                          <div style="font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </div>
                        </div>
                        
                        <p style="margin: 30px 0 20px; color: #4b5563; font-size: 14px; line-height: 1.5;">
                          This code will expire in <strong>5 minutes</strong>. If you didn't request this code, please ignore this email.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>Security Tip:</strong> Never share this code with anyone. CaptchaⱮaster will never ask for your verification code.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          This is an automated message, please do not reply to this email.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
        CaptchaⱮaster - Verification Code
        
        ${name ? `Hi ${name},` : 'Hello,'}
        
        Your verification code is: ${otp}
        
        This code will expire in 5 minutes.
        
        If you didn't request this code, please ignore this email.
        
        © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ OTP email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending OTP email:', error)
    return false
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

interface SendPasswordResetEmailParams {
  email: string
  resetToken: string
  name?: string
}

export async function sendPasswordResetEmail({
  email,
  resetToken,
  name,
}: SendPasswordResetEmailParams): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    const fromEmail = await getFromEmail()

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // In development without SMTP, just log the reset link
    if (!transporter) {
      console.log('📧 [DEV MODE] Password Reset Email for', email)
      console.log('🔗 Reset Link:', resetUrl)
      console.log('⚠️  Configure SMTP settings in .env.local for production')
      return true
    }

    const mailOptions = {
      from: `"CaptchaⱮaster" <${fromEmail}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                          Captcha<span style="color: #6366f1;">Ɱaster</span>
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          ${name ? `Hi ${name},` : 'Hello,'}
                        </p>
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          We received a request to reset your password for your CaptchaⱮaster account. Click the button below to create a new password:
                        </p>
                        
                        <!-- Reset Button -->
                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                            Reset Password
                          </a>
                        </div>
                        
                        <p style="margin: 30px 0 20px; color: #4b5563; font-size: 14px; line-height: 1.5;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="margin: 0 0 30px; color: #6366f1; font-size: 14px; line-height: 1.5; word-break: break-all;">
                          ${resetUrl}
                        </p>
                        
                        <p style="margin: 30px 0 20px; color: #4b5563; font-size: 14px; line-height: 1.5;">
                          This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>Security Tip:</strong> Never share your password reset link with anyone. CaptchaⱮaster will never ask for your password.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          This is an automated message, please do not reply to this email.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
        CaptchaⱮaster - Reset Your Password
        
        ${name ? `Hi ${name},` : 'Hello,'}
        
        We received a request to reset your password. Click the link below to create a new password:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, you can safely ignore this email.
        
        © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending password reset email:', error)
    return false
  }
}

interface SendWelcomeEmailParams {
  email: string
  name: string
  isOAuth?: boolean
}

export async function sendWelcomeEmail({
  email,
  name,
  isOAuth = false,
}: SendWelcomeEmailParams): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    const fromEmail = await getFromEmail()

    // In development without SMTP, just log
    if (!transporter) {
      console.log('📧 [DEV MODE] Welcome Email for', email)
      console.log('⚠️  Configure SMTP settings in .env.local for production')
      return true
    }

    const mailOptions = {
      from: `"CaptchaⱮaster" <${fromEmail}>`,
      to: email,
      subject: 'Welcome to CaptchaⱮaster! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to CaptchaⱮaster</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                          Captcha<span style="color: #6366f1;">Ɱaster</span>
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                          Welcome aboard, ${name}! 🎉
                        </h2>
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for joining CaptchaⱮaster! Your account has been successfully created${isOAuth ? ' via Google' : ''}.
                        </p>
                        
                        <!-- Free Trial Box -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0;">
                          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 20px; font-weight: 600;">
                            🎁 Your Free Trial is Active!
                          </h3>
                          <p style="margin: 0 0 10px; color: #ffffff; font-size: 16px;">
                            <strong>100 Free Credits</strong> - Valid for 3 days
                          </p>
                          <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                            Start solving captchas right away with your trial credits!
                          </p>
                        </div>
                        
                        <h3 style="margin: 30px 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                          What's Next?
                        </h3>
                        <ul style="margin: 0 0 30px; padding-left: 20px; color: #4b5563; font-size: 16px; line-height: 1.8;">
                          <li>Access your dashboard to view your account details</li>
                          <li>Download our browser extension for easy integration</li>
                          <li>Check out our API documentation</li>
                          <li>Explore pricing plans for continued service</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                            Go to Dashboard
                          </a>
                        </div>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                          <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                            <strong>Need Help?</strong> Our support team is here to assist you. Feel free to reach out anytime!
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          This is an automated message, please do not reply to this email.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
        CaptchaⱮaster - Welcome!
        
        Welcome aboard, ${name}!
        
        Thank you for joining CaptchaⱮaster! Your account has been successfully created${isOAuth ? ' via Google' : ''}.
        
        🎁 Your Free Trial is Active!
        100 Free Credits - Valid for 3 days
        
        What's Next?
        - Access your dashboard to view your account details
        - Download our browser extension for easy integration
        - Check out our API documentation
        - Explore pricing plans for continued service
        
        Visit your dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
        
        © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    return false
  }
}

interface SendLoginNotificationParams {
  email: string
  name: string
  loginTime: Date
  ipAddress?: string
  userAgent?: string
}

export async function sendLoginNotification({
  email,
  name,
  loginTime,
  ipAddress,
  userAgent,
}: SendLoginNotificationParams): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    const fromEmail = await getFromEmail()

    // In development without SMTP, just log
    if (!transporter) {
      console.log('📧 [DEV MODE] Login Notification for', email)
      console.log('⚠️  Configure SMTP settings in .env.local for production')
      return true
    }

    const formattedTime = loginTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })

    const mailOptions = {
      from: `"CaptchaⱮaster Security" <${fromEmail}>`,
      to: email,
      subject: 'New Login to Your CaptchaⱮaster Account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Notification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                          Captcha<span style="color: #6366f1;">Ɱaster</span>
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                          New Login Detected
                        </h2>
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Hi ${name},
                        </p>
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          We detected a new login to your CaptchaⱮaster account. Here are the details:
                        </p>
                        
                        <!-- Login Details Box -->
                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 30px 0;">
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Time:</td>
                              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${formattedTime}</td>
                            </tr>
                            ${ipAddress ? `
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">IP Address:</td>
                              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${ipAddress}</td>
                            </tr>
                            ` : ''}
                            ${userAgent ? `
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Device:</td>
                              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${userAgent.substring(0, 50)}...</td>
                            </tr>
                            ` : ''}
                          </table>
                        </div>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                          <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>Was this you?</strong>
                          </p>
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            If you don't recognize this login, please secure your account immediately by changing your password.
                          </p>
                        </div>
                        
                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/profile" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                            Secure My Account
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          This is an automated security notification. Please do not reply to this email.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
        CaptchaⱮaster - New Login Detected
        
        Hi ${name},
        
        We detected a new login to your CaptchaⱮaster account.
        
        Login Details:
        Time: ${formattedTime}
        ${ipAddress ? `IP Address: ${ipAddress}` : ''}
        ${userAgent ? `Device: ${userAgent}` : ''}
        
        Was this you?
        If you don't recognize this login, please secure your account immediately by changing your password.
        
        Visit your profile: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/profile
        
        © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Login notification sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending login notification:', error)
    return false
  }
}

interface SendSubscriptionEmailParams {
  email: string
  name: string
  planName: string
  price: number
  credits: number
  endDate: Date
}

export async function sendSubscriptionEmail({
  email,
  name,
  planName,
  price,
  credits,
  endDate,
}: SendSubscriptionEmailParams): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    const fromEmail = await getFromEmail()

    if (!transporter) {
      console.log('📧 [DEV MODE] Subscription Email for', email)
      console.log('⚠️  Configure SMTP settings in .env.local for production')
      return true
    }

    const formattedDate = endDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const mailOptions = {
      from: `"CaptchaⱮaster Billing" <${fromEmail}>`,
      to: email,
      subject: `Subscription Confirmed: ${planName} Plan 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                          Captcha<span style="color: #6366f1;">Ɱaster</span>
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center;">
                          Subscription Activated! 🚀
                        </h2>
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Hi ${name},
                        </p>
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Thank you for choosing CaptchaⱮaster. Your subscription for the <strong>${planName}</strong> plan has been successfully activated.
                        </p>
                        
                        <!-- Plan Details Box -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; color: #ffffff;">
                          <h3 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">
                            Plan Details
                          </h3>
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Plan Name:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${planName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Credits:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${credits.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Amount Paid:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">$${price.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Valid Until:</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${formattedDate}</td>
                            </tr>
                          </table>
                        </div>
                        
                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
                            Start Solving Now
                          </a>
                        </div>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            Need your API key? You can find it in your <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/api-keys" style="color: #6366f1; text-decoration: none; font-weight: 600;">dashboard settings</a>.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          You received this email because you subscribed to a plan on CaptchaⱮaster.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
        CaptchaⱮaster - Subscription Activated!
        
        Hi ${name},
        
        Your subscription for the ${planName} plan has been successfully activated.
        
        Plan Details:
        - Plan Name: ${planName}
        - Credits: ${credits.toLocaleString()}
        - Amount Paid: $${price.toFixed(2)}
        - Valid Until: ${formattedDate}
        
        Start using your credits at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
        
        © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Subscription email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending subscription email:', error)
    return false
  }
}

interface SendAccountStatusEmailParams {
  email: string
  name: string
  status: string
  reason?: string
}

export async function sendAccountStatusEmail({
  email,
  name,
  status,
  reason,
}: SendAccountStatusEmailParams): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    const fromEmail = await getFromEmail()

    if (!transporter) {
      console.log('📧 [DEV MODE] Account Status Email for', email, 'Status:', status)
      console.log('⚠️  Configure SMTP settings in .env.local for production')
      return true
    }

    const isActivated = status.toLowerCase() === 'active'
    const subject = isActivated
      ? 'Your Account has been Activated! 🎉'
      : 'Important: Account Status Update'

    const statusColor = isActivated ? '#10b981' : '#ef4444'
    const statusBg = isActivated ? '#d1fae5' : '#fee2e2'
    const statusText = isActivated ? '#065f46' : '#991b1b'

    const mailOptions = {
      from: `"CaptchaⱮaster Support" <${fromEmail}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                          Captcha<span style="color: #6366f1;">Ɱaster</span>
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                          Account Status Update
                        </h2>
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Hi ${name},
                        </p>
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          This email is to inform you that your account status has been updated.
                        </p>
                        
                        <!-- Status Box -->
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: ${statusBg}; border-radius: 12px; border: 1px solid ${statusColor};">
                          <p style="margin: 0 0 10px; color: ${statusText}; font-size: 14px; font-weight: 600;">Current Status</p>
                          <p style="margin: 0; color: ${statusText}; font-size: 24px; font-weight: 700; text-transform: uppercase;">
                            ${status}
                          </p>
                        </div>

                        ${reason ? `
                        <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
                          <p style="margin: 0 0 5px; color: #374151; font-size: 14px; font-weight: 600;">Reason/Details:</p>
                          <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">${reason}</p>
                        </div>
                        ` : ''}
                        
                        ${isActivated ? `
                        <p style="margin: 30px 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          You can now access all features of your account. We're glad to have you with us!
                        </p>
                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                            Go to Dashboard
                          </a>
                        </div>
                        ` : `
                        <p style="margin: 30px 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          If you believe this is a mistake or have any questions, please contact our support team immediately.
                        </p>
                        `}
                        
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          This is an automated message, please do not reply to this email.
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                          © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
        CaptchaⱮaster - Account Status Update
        
        Hi ${name},
        
        Your account status has been updated to: ${status.toUpperCase()}
        
        ${reason ? `Reason: ${reason}` : ''}
        
        ${isActivated ? 'You can now access all features of your account.' : 'If you have questions, please contact support.'}
        
        © ${new Date().getFullYear()} CaptchaⱮaster. All rights reserved.
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Account status email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending account status email:', error)
    return false
  }
}
