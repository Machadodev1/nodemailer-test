import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Transportador Gmail simple según tu snippet, convertido a ESM y usando env `GPASS`.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || process.env.SMTP_USER || 'egxxxx@xsena.edu.co',
    pass: process.env.GPASS,
  },
});

export async function sendEmail(email, subject, text) {
  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.GMAIL_USER || 'egxx@xxsena.edu.co',
    to: email,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return reject(err);
      }
      console.log('Correo enviado', info.response);
      resolve(info);
    });
  });
}
