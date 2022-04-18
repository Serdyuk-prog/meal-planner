const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Plan = require("../models/plan");
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

const seedDB = async () => {
    await Plan.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const plan = new Plan({
            title: `Plan #${i}`,
        });
        await plan.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
