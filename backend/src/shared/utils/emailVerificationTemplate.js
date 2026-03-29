import { APP_NAME, FRONTEND_URL } from '../config/index.js';

export const generateVerificationEmailTemplate = ({ userName, verificationLink }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Verify Your Email</title>
    <style>
        /* Global Reset & Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            mso-line-height-rule: exactly; /* Outlook specific */
        }
        
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        
        td, th {
            padding: 0;
        }

        /* Utility Classes */
        .full-width-table { width: 100%; max-width: 600px; }
        .content-padding { padding: 40px; }
        .text-center { text-align: center; }

        /* Component Styles */
        .email-header-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
            line-height: 60px; /* Vertically center PFE text */
        }
        
        .cta-button-td {
            padding: 15px 0 25px 0;
        }

        /* Responsive Styles */
        @media only screen and (max-width: 600px) {
            .content-padding {
                padding: 30px 20px !important;
            }
            .header-padding {
                padding: 30px 20px !important;
            }
            .cta-button {
                display: block !important;
                width: 100% !important;
                padding: 14px 0 !important;
            }
            .full-width-table {
                width: 100% !important;
                min-width: 100% !important;
            }
        }
        
        /* Specific Styles for Outlook */
        .outlook-fix {
            mso-padding-alt: 0;
        }
        
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa;">
    <center class="wrapper" style="width: 100%; table-layout: fixed; background-color: #f4f7fa;">
        <div style="max-width: 600px;">
            <div style="font-size: 0px; line-height: 0px; max-height: 0px; mso-hide: all; opacity: 0; overflow: hidden; color: #f4f7fa;">
                Welcome to ${APP_NAME}! Click to verify your email address.
            </div>

            <table class="full-width-table" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                
                <tr>
                    <td class="email-header-bg header-padding" style="padding: 40px 30px; text-align: center; border-radius: 0;">
                        <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                        ${APP_NAME}
                                    </h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td class="content-padding" style="padding: 50px 40px; background-color: #ffffff;">
                        <p style="font-size: 20px; font-weight: 600; color: #1a202c; margin: 0 0 20px 0;">
                            Hi ${userName},
                        </p>
                        
                        <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
                            Welcome to <strong>${APP_NAME}</strong>! We're excited to have you on board. 
                            To get started and ensure the security of your account, please verify your email address.
                        </p>

                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 30px 0;">
                            <tr>
                                <td style="background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf5 100%); border-left: 4px solid #667eea; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                                    <p style="margin: 0; font-size: 16px; color: #4a5568; font-weight: 500; text-align: center;">
                                        Click the button below to complete your registration:
                                    </p>
                                    
                                    <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                        <tr>
                                            <td class="text-center cta-button-td" style="text-align: center; padding: 20px 0 10px 0;">
                                                <a href="${verificationLink}" target="_blank" class="cta-button" 
                                                    style="display: inline-block; 
                                                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                                        color: #ffffff !important; 
                                                        text-decoration: none; 
                                                        padding: 16px 40px; 
                                                        border-radius: 8px; 
                                                        font-weight: 600; 
                                                        font-size: 16px; 
                                                        text-align: center; 
                                                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); 
                                                        mso-padding-alt: 0; /* Outlook fix */">
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <p style="margin: 0; font-size: 14px; color: #718096; text-align: center;">
                                        This link is valid for **24 hours**.
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <div style="text-align: center; margin: 30px 0; position: relative;">
                            <span style="background-color: #ffffff; padding: 0 15px; color: #a0aec0; font-size: 14px; position: relative; z-index: 1;">
                                OR
                            </span>
                            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); z-index: 0;"></div>
                        </div>

                        <div style="background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096;">
                                <strong>If the button above does not work, copy and paste this link into your browser:</strong>
                            </p>
                            <div class="token-code" style="font-family: 'Courier New', monospace; background-color: #edf2f7; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #2d3748; word-break: break-all; border: 1px solid #e2e8f0; margin-top: 8px;">
                                ${verificationLink}
                            </div>
                        </div>
                        
                        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                                <strong>⚠️ Security Notice:</strong> If you didn't create an account with ${APP_NAME}, 
                                please ignore this email. Your account will not be activated without this verification.
                            </p>
                        </div>
                        
                        <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 15px 0;">
                            <strong>What happens after verification?</strong> You will gain:
                        </p>
                        
                        <ul class="info-list" style="margin: 20px 0 30px 0; padding-left: 0; list-style: none;">
                            <li style="padding: 12px 0; padding-left: 30px; position: relative; font-size: 15px; color: #4a5568;">
                                <span style="position: absolute; left: 0; color: #667eea; font-weight: 700; font-size: 18px; line-height: 1;">✓</span>
                                Full access to your account
                            </li>
                            <li style="padding: 12px 0; padding-left: 30px; position: relative; font-size: 15px; color: #4a5568;">
                                <span style="position: absolute; left: 0; color: #667eea; font-weight: 700; font-size: 18px; line-height: 1;">✓</span>
                                Ability to manage your projects and sprints
                            </li>
                            <li style="padding: 12px 0; padding-left: 30px; position: relative; font-size: 15px; color: #4a5568;">
                                <span style="position: absolute; left: 0; color: #667eea; font-weight: 700; font-size: 18px; line-height: 1;">✓</span>
                                Collaborate with supervisors and team members
                            </li>
                        </ul>
                        
                        <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 0 0 30px 0;">
                            If you have any questions or need assistance, feel free to reach out to our support team.
                        </p>
                        
                        <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin: 30px 0 0 0;">
                            Best regards,<br>
                            <strong>The ${APP_NAME} Team</strong>
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #f7fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <div style="margin: 10px 0 20px;">
                            <a href="${FRONTEND_URL}/help" style="color: #667eea; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 500;">Help Center</a>
                            <a href="${FRONTEND_URL}/privacy" style="color: #667eea; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 500;">Privacy Policy</a>
                            <a href="${FRONTEND_URL}/terms" style="color: #667eea; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 500;">Terms</a>
                        </div>
                        
                        <p style="font-size: 13px; color: #718096; margin: 8px 0; line-height: 1.6;">
                            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                        </p>
                        
                        <p style="font-size: 13px; color: #718096; margin: 8px 0; line-height: 1.6;">
                            This email was sent to you because you registered an account on ${APP_NAME}.
                        </p>
                        
                        <p style="margin-top: 15px; color: #a0aec0; font-size: 12px;">
                            Please do not reply to this email. This mailbox is not monitored.
                        </p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
  `.trim();
};

export const generateVerificationEmailText = ({ userName, verificationLink }) => {
  return `
Hi ${userName},

Welcome to ${APP_NAME}! We're excited to have you on board.

To get started and ensure the security of your account, please verify your email address by clicking the link below:

${verificationLink}

This verification link will expire in 24 hours for security reasons.

What happens after verification?
✓ Full access to your account
✓ Ability to manage your projects and sprints
✓ Collaborate with supervisors and team members
✓ Track your PFE progress efficiently

SECURITY NOTICE: If you didn't create an account with ${APP_NAME}, please ignore this email. Your email address will not be used without verification.

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The ${APP_NAME} Team

---
© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.

This email was sent to you because you registered an account on ${APP_NAME}.
Please do not reply to this email. This mailbox is not monitored.
  `.trim();
};