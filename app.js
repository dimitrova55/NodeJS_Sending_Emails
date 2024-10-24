import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.smtp_user,
      pass: process.env.smtp_password
    }
  });

function sendEmail(){
    const mailOptions = {
        from: {
          name: "Dilyana Dimitrova",
          address: 'dilly@email.bg'
        },
        // to: 'user@domain.com',
        to: ['user@domain.com', 'second_user@domain.com', 'third_user@domain.com'],
        subject: 'Email test.',
        // text: 'Email sent with NodeJS using Nodemailer.'

        // HTML/CSS styling
        html: `
        <h3 style="color: #36ba9b;"> Hello user, </h3>
        <p style= "color: #555;"> This email was sent using Node.js with <b>Nodemailer</b></p>
        <p style= "color: #ccc; font-weight: bold;"> Regards, <br>Dilyana D.</p>
        `
    }

    transport.sendMail(mailOptions, (error, info) => {
      if(error)
        return console.log(`Error: ${error}`);

      return console.log(`Email sent successfully. Info: ${JSON.stringify(info)}`);       
    })
}

sendEmail();