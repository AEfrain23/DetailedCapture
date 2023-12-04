import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log("Server is runing on port 3000");
});