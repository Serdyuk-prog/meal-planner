const mongoose = require("mongoose");
const Meal = require("./meal");
const Plan = require("./plan");
const Schema = mongoose.Schema;

const DayPlanSchema = new Schema({
    dayNumber: Number,
    parentPlan: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
    },
    meals: [
        {
            type: Schema.Types.ObjectId,
            ref: "Meal",
        },
    ],
});

module.exports = mongoose.model("DayPlan", DayPlanSchema);
