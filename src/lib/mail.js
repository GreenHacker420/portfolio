import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: user,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const sendMail = async ({ to, subject, html, text }) => {
    try {
        const info = await transporter.sendMail({
            from: user,
            to,
            subject,
            html,
            text,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
