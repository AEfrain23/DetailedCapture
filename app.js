import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importing CORS middleware
import fetch from 'node-fetch';  // node-fetch v2 // For sending requests to reCAPTCHA API
import 'dotenv/config'; // For loading environment variables

const app = express();
const port = 3003;


// // CORS Configuration: Allowing requests from your live domain
// const corsOptions = {
//     origin: 'https://www.detailedcapture.com',  // Allow only your live domain
//     methods: ['GET', 'POST'],                   // Allow only GET and POST requests
//     allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
// };

// // Use the CORS middleware with these options
// app.use(cors(corsOptions));  // Enable CORS for the specific domain


// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/prints", (req, res) => {
  res.render("prints.ejs")
});

app.get("/about", (req, res) => {
  res.render("about.ejs")
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs")
});



// Route to handle form submission and reCAPTCHA validation
app.post("/send-message", (req, res) => {
  const { customerName, customerEmail, customerMessage, 'g-recaptcha-response': captchaResponse } = req.body;

  // Step 1: Verify reCAPTCHA response with Google
  const secretKey = process.env.RECAPTCHA_KEY;  // Store this in your .env file

  const params = new URLSearchParams({
    secret: secretKey,
    response: captchaResponse,
    remoteip: req.ip,
  });

  fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: params,
  })
    .then(response => response.json())
    .then(data => {
      // Step 2: If reCAPTCHA validation is successful, send the email
      if (data.success) {
        console.log("Successful reCAPTCHA validation");

        let transporter = nodemailer.createTransport({
          host: 'smtp-relay.sendinblue.com',
          port: 587,
          auth: {
            user: "angelefrain23@gmail.com",  // Your email
            pass: process.env.SMTP_KEY,   // Your SMTP key
          },
        });

        const message = {
          from: customerEmail,
          to: "detailedcapture@gmail.com",
          subject: `detailedcapture.com - ${customerName}`,
          text: `Customer Name: ${customerName}\nCustomer Message: ${customerMessage}`,  // Use newlines for clarity
        };

        // Send the email using Nodemailer
        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Error sending email" });
          } else {
            console.log(info);
            const emailSent = "Email sent successfully";
            const textResponse = "Thank you for you message.";
            // Step 3: Render the confirmation page with a success message
            res.render("contact.ejs", { confirmation: emailSent, textMessage: textResponse });  // Render the EJS page with the confirmation message
          }
        });

      } else {
        // If reCAPTCHA failed, render the contact page with an error message
        const errorMessage = "reCAPTCHA validation failed";
        const textResponse = "Please try again.";
        console.log("reCAPTCHA validation failed.");
        res.render("contact.ejs", { confirmation: errorMessage, textMessage: textResponse });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Error validating reCAPTCHA" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
