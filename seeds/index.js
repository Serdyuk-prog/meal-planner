const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Plan = require("../models/plan");
const DayPlan = require("../models/dayPlan");
const Meal = require("../models/meal");
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

const mealNames = ["Breakfast", "Lunch", "Dinner"];

// const seedDB = async () => {
//     await Plan.deleteMany({});
//     for (let i = 0; i < 5; i++) {
//         const plan = new Plan({
//             title: `Plan #${i}`,
//         });
//         await plan.save();
//     }
// };

const seedDB = async () => {
    await Meal.deleteMany({});
    await DayPlan.deleteMany({});
    await Plan.deleteMany({});

    const plan = new Plan({
        title: `Plan #1`,
    });

    for (let i = 0; i < 7; i++) {
        const dayPlan = new DayPlan({
            dayNumber: i,
            parentPlan: plan._id,
        });
        for (let j = 0; j < 3; j++) {
            const meal = new Meal({
                name: mealNames[j],
                dish: "Broccoli",
                ingredients: "broccoli, broccoli, broccoli",
                cost: 4.2,
            });
            dayPlan.meals.push(meal);
            await meal.save();
        }
        plan.dayPlans.push(dayPlan);
        await dayPlan.save();
    }

    await plan.save();
};

seedDB().then(() => {
    mongoose.connection.close();
});
