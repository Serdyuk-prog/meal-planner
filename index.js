const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Plan = require("./models/plan");
const DayPlan = require("./models/dayPlan");
const Meal = require("./models/meal");
const catchAsyc = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { planSchema, mealSchema } = require("./schemas.js");

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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validatePlan = (req, res, next) => {
    const { error } = planSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const validateMeal = (req, res, next) => {
    const { error } = mealSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.redirect("/plans");
});

app.get(
    "/plans",
    catchAsyc(async (req, res) => {
        const plans = await Plan.find({});
        res.render("plans/index", { plans });
    })
);

app.get("/plans/new", (req, res) => {
    res.render("plans/newPlan", { days });
});

app.post(
    "/plans",
    validatePlan,
    catchAsyc(async (req, res) => {
        const plan = new Plan(req.body.plan);
        for (let i = 0; i < 7; i++) {
            const dayPlan = new DayPlan({
                dayNumber: i,
                parentPlan: plan._id,
            });
            plan.dayPlans.push(dayPlan);
            await dayPlan.save();
        }
        await plan.save();
        res.redirect(`/plans/${plan._id}`);
    })
);

app.get(
    "/plans/:id",
    catchAsyc(async (req, res) => {
        const plan = await Plan.findById(req.params.id).populate("dayPlans");
        let totalCost = 0;
        for (let element of plan.dayPlans) {
            const dayPlan = await DayPlan.findById(element._id).populate("meals");
            for (let meal of dayPlan.meals) {
                totalCost += meal.cost;
            }
        }
        res.render("plans/show", { plan, days, totalCost: totalCost.toFixed(2) });
    })
);

app.get(
    "/plans/:id/edit",
    catchAsyc(async (req, res) => {
        const plan = await Plan.findById(req.params.id);
        res.render("plans/edit", { plan });
    })
);

app.put(
    "/plans/:id",
    validatePlan,
    catchAsyc(async (req, res) => {
        const { id } = req.params;
        const plan = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
        res.redirect(`/plans/${plan._id}`);
    })
);

app.delete(
    "/plans/:id",
    catchAsyc(async (req, res) => {
        const { id } = req.params;
        const plan = await Plan.findById(id);
        for (let dayPlan of plan.dayPlans) {
            await DayPlan.findByIdAndDelete(dayPlan);
        }
        await Plan.findByIdAndDelete(id);
        res.redirect("/plans");
    })
);

app.get(
    "/dayPlans/:dayPlanId",
    catchAsyc(async (req, res) => {
        const { dayPlanId } = req.params;
        const dayPlan = await DayPlan.findById(dayPlanId).populate("meals");
        const plan = await Plan.findById(dayPlan.parentPlan);
        res.render("plans/showDay", { plan, dayPlan, days });
    })
);

app.post(
    "/dayPlans/:dayPlanId/meal",
    validateMeal,
    catchAsyc(async (req, res) => {
        const { dayPlanId } = req.params;
        const dayPlan = await DayPlan.findById(dayPlanId);
        const meal = new Meal(req.body.meal);
        dayPlan.meals.push(meal);
        await meal.save();
        await dayPlan.save();
        res.redirect(`/dayPlans/${dayPlanId}`);
    })
);

app.get(
    "/dayPlans/:dayPlanId/meal/:mealId/edit",
    catchAsyc(async (req, res) => {
        const { dayPlanId, mealId } = req.params;
        const meal = await Meal.findById(mealId);
        res.render("plans/editMeal", { dayPlanId, meal });
    })
);

app.delete(
    "/dayPlans/:dayPlanId/meal/:mealId",
    catchAsyc(async (req, res) => {
        const { dayPlanId, mealId } = req.params;
        await DayPlan.findByIdAndUpdate(dayPlanId, { $pull: { meals: mealId } });
        await Meal.findByIdAndDelete(mealId);
        res.redirect(`/dayPlans/${dayPlanId}`);
    })
);

app.put(
    "/dayPlans/:dayPlanId/meal/:mealId",
    validateMeal,
    catchAsyc(async (req, res) => {
        const { dayPlanId, mealId } = req.params;
        const meal = await Meal.findByIdAndUpdate(mealId, { ...req.body.meal });
        res.redirect(`/dayPlans/${dayPlanId}`);
    })
);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Something went wrong!";
    if (!err.status) err.status = 500;
    const { status } = err;
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Listening оn port 3000");
});
