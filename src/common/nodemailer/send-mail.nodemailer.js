import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "nhaantn98@gmail.com",
    pass: "wmnivlgxjdgfuqcg",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Nhân đẹp trai 👻" <nhaantn98@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Nhân đẹp trai: TIÊN TRI VŨ TRỤ", // plain text body
    html: "<h1>Chào mừng bạn đến với Vũ Trụ Tiên Tri</h1>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default sendMail;
