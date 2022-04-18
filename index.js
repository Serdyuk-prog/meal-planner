const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Plan = require("./models/plan");
const { captureRejectionSymbol } = require("events");

mongoose
    .connect("mongodb://localhost:27017/meal-planner")
    .then(() => {
        console.log("MONGO CONNECTION OPEN!");
    })
    .catch((ERR) => {
        console.log("MONGO CONNECTION ERROR!", ERR);
    });

const db = mongoose.connection;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});



app.listen(3000, () => {
    console.log("Listening оn port 3000");
});
