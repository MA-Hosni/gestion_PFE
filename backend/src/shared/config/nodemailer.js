import nodemailer from "nodemailer";
import { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } from './index.js';

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
  host: "smtp.gmail.com",
  port: 587,
  tls: {
    rejectUnauthorized: true
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Nodemailer configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export default transporter;