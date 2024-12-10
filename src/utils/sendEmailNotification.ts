import nodemailer from 'nodemailer';

export const sendEmailNotification = async (email: string, message: string, htmlBody?: string, emailSubject?: string) => {
    // console.log(email, message, emailSubject);
    const transporter = nodemailer.createTransport({
        name: 'smtp.gmail.com',
        host: "smtp.gmail.com",
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: emailSubject,
        text: message,
        html: htmlBody
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
