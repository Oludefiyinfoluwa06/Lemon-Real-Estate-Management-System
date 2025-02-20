const nodemailer = require("nodemailer");

const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const emailBody = `
            <h1>${name}</h1>
            <p>${email}</p>
            <p>${message}</p>
        `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "oludefiyinfoluwa06@gmail.com",
      subject: subject || `Message from ${name}`,
      html: emailBody,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.json({ error: "An error occurred" });
      }

      return res.json({ message: "Email sent successfully" });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
};
