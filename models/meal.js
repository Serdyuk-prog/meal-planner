const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealSchema = new Schema({
    name: String,
    dish: String,
    ingredients: String
})

module.exports = mongoose.model("Meal", MealSchema);