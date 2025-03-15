import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();

const port =process.env.PORT||3000;
const app = express();

const apikey = process.env.API_KEY; // API Key

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { weather: null, error: null });
});

app.post("/submit", async (req, res) => {
    let city = req.body.city.trim(); 

    
    if (!city) {
        return res.render("index.ejs", { weather: null, error: "Please enter a valid city name." });
    }

    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);

        res.render("index.ejs", { weather: result.data, error: null });

    } catch (err) {
        console.error(err.message);

        if (err.response && err.response.status === 404) {
            res.render("index.ejs", { weather: null, error: "City not found. Check the spelling and try again!" });
        } else {
            res.render("index.ejs", { weather: null, error: "Something went wrong. Please try again later!" });
        }
    }
});

app.get("/about",(req,res)=>{
  res.render("about.ejs");
});

app.get("/contact",(req,res)=>{
   res.render("contact.ejs");
 });

 app.get("/index",(req,res)=>{
  res.redirect("/");
});

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
