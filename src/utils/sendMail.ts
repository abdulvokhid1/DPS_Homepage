/** @format */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `http://localhost:4000/api/user/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"DPS" <${process.env.MAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `<h3>Click to verify your email:</h3><p><a href="${link}">${link}</a></p>`,
  });
};
