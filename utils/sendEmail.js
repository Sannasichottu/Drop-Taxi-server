const nodemailer = require("nodemailer");

module.exports = async (email, link, username) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.my_gmail}`,
        pass: `${process.env.my_pass}`,
      },
    });

    await transporter.sendMail({
      from: "Car Corner",
      to: email,
      subject: "Link to reset password",
      html: `<h1>Hello ${username}</h1>
          <p>You are requested to change password</p>
          <p>Please click on the following link or paste this in your browser to complete the process of reset password</p>
            <a href=${link} target=_parent>Click to reset password</a>
            <p>Automatically it redirected you to resetpassword page</p>`,
    });
  } catch (error) {
    console.log(Error);
  }
};
