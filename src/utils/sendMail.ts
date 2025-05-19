/** @format */

// /** @format */

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER, // use .env for security
//     pass: process.env.MAIL_PASS,
//   },
// });

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const link = `http://localhost:4000/api/user/verify-email?token=${token}`;
//   await transporter.sendMail({
//     to: email,
//     subject: "Verify Your Email",
//     html: `<p>Please verify your email by clicking <a href="${link}">here</a>.</p>`,
//   });
// };
