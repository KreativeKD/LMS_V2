const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

let testAccount = null;
let transporter = null;

const createTransporter = async () => {
    if (transporter) return transporter;

    // Use OAuth2 if provided in .env
    if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET && process.env.OAUTH_REFRESH_TOKEN && process.env.GMAIL_USER) {
        const oauth2Client = new OAuth2(
            process.env.OAUTH_CLIENT_ID,
            process.env.OAUTH_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.OAUTH_REFRESH_TOKEN
        });

        try {
            const accessTokenResponse = await oauth2Client.getAccessToken();
            const accessToken = accessTokenResponse.token;
            
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.GMAIL_USER,
                    accessToken: accessToken,
                    clientId: process.env.OAUTH_CLIENT_ID,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN
                }
            });
            return transporter;
        } catch (err) {
            console.error('Failed to create OAuth2 access token', err);
            // Fallback will happen below if we don't throw, but let's just throw
            throw new Error('OAuth2 Authentication Failed');
        }
    }

    // Use actual SMTP config if provided in .env
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return transporter;
    }

    // Fallback to Ethereal Email for local testing
    if (!testAccount) {
        testAccount = await nodemailer.createTestAccount();
        console.log('Created new Ethereal test email account:', testAccount.user);
    }

    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    return transporter;
};

const sendPasswordResetEmail = async (email, username, resetToken) => {
    const tp = await createTransporter();
    // Assuming frontend runs on 5173 for local dev, adjust as needed or use ENV var
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: '"CourseZ Support" <support@coursez.in>', // sender address
        to: email, // list of receivers
        subject: 'CourseZ - Password Reset Request', // Subject line
        text: `Hello ${username},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\nThis link will expire in 1 hour.`, // plain text body
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #0f172a;">Password Reset Request</h2>
                <p>Hello <strong>${username}</strong>,</p>
                <p>We received a request to reset your password for your CourseZ account.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
                <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                <p style="color: #64748b; font-size: 0.9em; margin-top: 30px;">This link will expire in 1 hour.</p>
            </div>
        `, // html body
    };

    const info = await tp.sendMail(mailOptions);
    
    // If using Ethereal, log the preview URL
    if (info.messageId && !process.env.SMTP_HOST) {
        console.log('\n======================================================');
        console.log('MOCK EMAIL SENT!');
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log('======================================================\n');
    }

    return info;
};

module.exports = {
    sendPasswordResetEmail,
};
