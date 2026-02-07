const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendContactEmail = async ({ name, email, message }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM,
      // above for testing will be onboarding@resend.dev, which is Resend’s pre-verified test sender.
      to: process.env.MAIL_TO,
      subject: "New portfolio contact message",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
    } else {
      console.log("Resend success:", data);
    }
  } catch (err) {
    console.error("Resend exception:", err);
  }
};

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// exports.sendContactEmail = async ({ name, email, message }) => {
//   await transporter.sendMail({
//     from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
//     to: process.env.MAIL_TO,
//     subject: "New portfolio contact message",
//     text: `
// Name: ${name}
// Email: ${email}

// Message:
// ${message}
//     `,
//   });
// };
