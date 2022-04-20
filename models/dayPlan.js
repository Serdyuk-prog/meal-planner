const mongoose = require("mongoose");
const Meal = require("./meal");
const Schema = mongoose.Schema;

const DayPlanSchema = new Schema({
    dayNumber: Number,
    meals: [
        {
            type: Schema.Types.ObjectId,
            ref: "Meal",
        },
    ],
});

module.exports = mongoose.model("DayPlan", DayPlanSchema);
