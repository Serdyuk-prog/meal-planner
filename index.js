const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Plan = require("./models/plan");
const DayPlan = require("./models/dayPlan");
const Meal = require("./models/meal");
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
    // res.render("home");
    res.redirect("/plans");
});

app.get("/plans", async (req, res) => {
    const plans = await Plan.find({});
    res.render("plans/index", { plans });
});

app.get("/plans/new", (req, res) => {
    res.render("plans/new");
});

app.post("/plans", async (req, res) => {
    const plan = new Plan(req.body.plan);
    await plan.save();
    res.redirect(`/plans/${plan._id}`);
});

app.get("/plans/:id", async (req, res) => {
    const plan = await Plan.findById(req.params.id).populate("dayPlans");
    res.render("plans/show", { plan });
    //res.send(plan);
});

app.get("/plans/:id/edit", async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.render("plans/edit", { plan });
});

app.put("/plans/:id", async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
    res.redirect(`/plans/${plan._id}`);
});

app.delete("/plans/:id", async (req, res) => {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    res.redirect("/plans");
});

app.listen(3000, () => {
    console.log("Listening оn port 3000");
});
