import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import ejs from "ejs";
import { log } from "console";

// Get __filename and __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


function sendEmailWithAttachment(){
  const mailOptions = {
      from: {
        name: "Dilyana Dimitrova",
        address: 'dilly@email.bg'
      },
      to: 'user@domain.com',
      subject: 'Email test.',
      text: 'Email with Attachment.',
      /*
      attachments: {
        filename: 'attachment_1.txt',
        content: 'Hello, user, this is a text file.'
      }
       */
      attachments: [
        {
          filename: 'attachment_1.txt',
          content: 'Hello, user, this is a text file.'
        },
        {
          filename: 'attachment_2.jpg',
          path: path.join(__dirname, 'public', 'picture_1.jpg') 
        }]      
  }

  transport.sendMail(mailOptions, (error, info) => {
    if(error)
      return console.log(`Error: ${error}`);

    return console.log(`Email sent successfully. Info: ${JSON.stringify(info)}`);       
  })
}


function sendEmailWithEmbeddedImage(){
  const mailOptions = {
      from: {
        name: "Dilyana Dimitrova",
        address: 'dilly@email.bg'
      },
      to: 'user@domain.com',
      subject: 'Email test.',
      html: 'Email with Embedded Image <br> <img width=500 src="cid:unique_id@domain.com"/>',
      attachments: 
        {
          filename: 'attachment_2.jpg',
          path: path.join(__dirname, 'public', 'picture_1.jpg'),
          cid: 'unique_id@domain.com'
        }      
  }

  transport.sendMail(mailOptions, (error, info) => {
    if(error)
      return console.log(`Error: ${error}`);

    return console.log(`Email sent successfully. Info: ${JSON.stringify(info)}`);       
  })
}


// sendEmail();
// sendEmailWithAttachment();
// sendEmailWithEmbeddedImage();

/***** Sending Emails with Templates ******/

const templateData = {userName: "John Doe"}

/*
ejs.renderFile(__dirname + '/views/index.ejs', templateData, (error, template) => {
  if(error)
    console.log('Error: ', error);

  const mailOptions = {
        from: {
          name: "Dilyana Dimitrova",
          address: 'dilly@email.bg'
        },
        // to: 'user@domain.com',
        to: ['user@domain.com', 'second_user@domain.com', 'third_user@domain.com'],
        subject: 'Email test.',
        html: template
    }

    transport.sendMail(mailOptions, (error, info) => {
      if(error)
        return console.log(`Error: ${error}`);
  
      return console.log(`Email sent successfully. Info: ${JSON.stringify(info)}`);       
    }) 
})
*/

/***** Sending Emails with Templates ******/

async function sendEmailWithTemplate(to, subject, template, data) {
  try {
    const html = await ejs.renderFile(__dirname + '/views/' + template, data, {async: true})

    const mailOptions = {
      from: 'dilly@email.bg',
      to: to,
      subject: subject,
      html: html
    }

    await transport.sendMail(mailOptions)
    console.log('Message sent successfully.');

  } catch (error) {
    console.log('Error: ', error);    
  }
}

sendEmailWithTemplate('user@domain.com', 'Dynamic Email Templates with EJS.', 'index.ejs', templateData)

/* if we are going to use the sendEmailWithTemplates function inside an express route,
 * the 'await' word shoud be added infront! */