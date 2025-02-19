const nodemailer = require('nodemailer');

class MailService {
  createTransport(){
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return transporter;
  }

  async sendByMail(mailTo, subject, msg){
    const transporter = this.createTransport();

    const mailOptions = {
      from: process.env.Mail_USER,
      to: mailTo,
      subject,
      html: msg
    }

    try{
      await transporter.sendMail(mailOptions);
    } catch(err){
      console.log(err)
    }
  }
}

module.exports = new MailService()