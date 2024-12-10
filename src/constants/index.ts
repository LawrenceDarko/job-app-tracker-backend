export const passwordResetEmail = (resetToken: string, user: any) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Avenir Next', Avenir, Helvetica, sans-serif;
                line-height: 24px;
                color: #342b50;
                background-color: #fff;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 3px auto;
                border-radius: 2px;
                color: #342b50;
                background-color: #F0FEFD;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
                overflow: hidden;
            }
            .header {
                font-size: 24px;
                line-height: 32px;
                margin-bottom: 20px;
                color: #342b50;
                font-weight: bold;
                background-color: transparent;
                padding: 20px 50px;
                text-align: center;
                border-radius: 2px 2px 0 0;
            }
            .content {
                margin-bottom: 20px;
                padding: 20px;
                text-align: left;
            }
            .content p {
                margin: 0 0 15px;
                font-size: 1.2em;
                color: #342b50;
                font-weight: 500;
            }
            .support-con {
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;
                margin-bottom: 30px;
            }
            .emaillogo {
                text-align: center;
            }
            .emaillogo img {
                width: 200px;
                height: auto;
            }
            .footer {
                font-size: 1em;
                color: #777;
                padding: 10px 20px;
                text-align: center;
                background-color: #F8FAFC;
                border-radius: 0 0 12px 12px;
            }
            .footer a {
                color: #299D91;
                text-decoration: none;
            }
            .btn {
                display: inline-block;
                background-color: #299D91;
                color: #fff;
                padding: 12px 30px;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-size: 1em;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }
            .btn:hover {
                background-color: #257e76;
            }
        </style>
    </head>
    <body>
        <div class="emaillogo">
            <img src="https://finance-tracker-multiuser-backend.onrender.com/uploads/emaillogo.png" />
        </div>
        <div class="container">
            <div class="header">Password Reset Request</div>
            <div class="content">
                <p>Hi ${user.username},</p>
                <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following button, or paste this URL into your browser to complete the process:</p>
                <div class="support-con">
                    <a href="${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}" class="btn"><font style="color: #fff; text-decoration: none;">Reset Password</font></a>
                </div>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                <p>Thank you,</p>
                <p>The Fynnq Team</p>
            </div>
            <div class="footer">
                <p>For any assistance, please contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
                <p>This message was sent to ${user.email} as a Fynnq customer. If you wish to unsubscribe from future emails, please <a href="#">click here</a>.</p>
                <p>© 2024 Fynnq. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};