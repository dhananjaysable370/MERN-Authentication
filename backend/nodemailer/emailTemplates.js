export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>
MERN-Auth<br>
<a href="mailto:mern.auth.dev@gmail.com">mern.auth.dev@gmail.com</a>
</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>MERN-Auth</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style type="text/css">
       
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f5f5f5;
            padding-bottom: 60px;
        }

        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        }

        .header {
            padding: 25px 30px;
            text-align: center;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 1px;
        }


        .content {
            padding: 20px 30px 10px 30px;
        }

        .hero {
            background-color: #ecfdf5;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 25px;
            text-align: center;
        }

        .hero h1 {
            color: #047857;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .hero p {
            margin-top: 0;
            margin-bottom: 20px;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #10B981;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 10px 0;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #059669;
        }

        .features {
            display: table;
            width: 100%;
            margin: 25px 0;
        }

        .feature {
            display: table-cell;
            width: 33.33%;
            padding: 15px;
            text-align: center;
            vertical-align: top;
        }

        .feature-icon {
            font-size: 30px;
            margin-bottom: 10px;
            color: #10B981;
        }

        .feature h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #047857;
            font-size: 16px;
        }

        .feature p {
            margin: 0;
            font-size: 14px;
        }


        .divider {
            height: 1px;
            background-color: #d1fae5;
            margin: 25px 0;
        }


        .footer {
            padding: 20px 30px;
            text-align: center;
            background-color: #ecfdf5;
            color: #6b7280;
            font-size: 12px;
        }

        .social {
            margin: 15px 0;
        }

        .social a {
            display: inline-block;
            margin: 0 8px;
            color: #10B981;
            text-decoration: none;
        }

        /* Responsive adjustments */
        @media screen and (max-width: 600px) {
            .main {
                width: 95%;
            }

            .features, .feature {
                display: block;
                width: 100%;
            }

            .feature {
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" width="100%">
            <!-- HEADER -->
            <tr>
                <td class="header">
                    <div class="logo">MERN-Auth</div>
                </td>
            </tr>

            <!-- CONTENT -->
            <tr>
                <td class="content">
                    <div class="hero">
                        <h1>Welcome to Our Platform!</h1>
                        <p>Thank you for verifying your email address. We're excited to have you join our community.</p>
                        <a href="http://localhost:5173/login" class="button">Get Started</a>
                    </div>

                    <p>Hello [Customer Name],</p>
                    <p>Your account has been successfully created and is ready to use. We're thrilled to have you on board!</p>

                    <div class="divider"></div>

                    <p>If you have any questions or need assistance, our support team is here to help. Just reply to this email or contact us through our support portal.</p>

                    <p>Best regards,<br>The MERN-Auth Team</p>
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td class="footer">
                    <div class="social">
                        <a href="#">Twitter</a>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                    </div>

                    <p>© 2025 MERN-Auth. All rights reserved.</p>
                    <p>Amravati, Maharashtra, India.</p>
                    <p>
                        <a href="#" style="color: #10B981;">Unsubscribe</a> |
                        <a href="#" style="color: #10B981;">Privacy Policy</a> |
                        <a href="#" style="color: #10B981;">View Online</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`
