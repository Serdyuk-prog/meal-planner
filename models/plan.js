const mongoose = require("mongoose");
const DayPlan = require("./dayPlan");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    title: String,
    dayPlans: [
        {
            type: Schema.Types.ObjectId,
            ref: "DayPlan",
        },
    ],
});

module.exports = mongoose.model("Plan", PlanSchema);
