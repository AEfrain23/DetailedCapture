import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import nodemailer from 'nodemailer';
import 'dotenv/config'


const app = express();
const port = 3003;

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




app.post("/send-message", (req, res) => {

    const params = new URLSearchParams({
        secret: "6LdG94sqAAAAAPEy6BuTyc1ItIc1MuoDM-mgTqJ9",
        response: req.body['g-recaptcha-response'],
        remoteip: req.ip,
    });

    fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: "POST",
        body: params,
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                res.json({ captchaSuccess: true })
                // ONCE CAPTURE IS SUCCESFUL SEND EMAIL USING NODEMAILER ----------
                const customerName = req.body.customerName;
                const customerEmail = req.body.customerEmail;
                const customerMessage = req.body.customerMessage;

                console.log(customerName + customerEmail + customerMessage);

                let transporter = nodemailer.createTransport({
                    host: 'smtp-relay.sendinblue.com',
                    port: 587,
                    auth: {
                        user: "angelefrain23@gmail.com",
                        pass: process.env.SMTP_KEY
                    }
                });

                const message = {
                    from: customerEmail,
                    to: "detailedcapture@gmail.com",
                    subject: "detailedcapture.com - " + customerName,
                    text: "Customer Name: " + customerName +
                        "\n" + "Customer Message: " + customerMessage  // REMEMBER: "\n" in concactonation creates a new line break.
                }

                transporter.sendMail(message, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                        // BEFORE WE WERE USING EJS (BELOW) TO RENDER POPUP MESSAGE, NOW WE ARE USING JavaScript in index.js.
                        // const emailSent = "Email sent successfully";
                        // res.render("contact.ejs", { confirmation: emailSent }); // REMEMBER: In order to render we must us a key-value-pair formatt.
                    }
                });
                // ----------------------------------------------------------------------


            } else {
                res.json({ captchaSuccess: false })
            }
        })





});



app.listen(port, () => {
    console.log("Server is runing on port 3003");
});