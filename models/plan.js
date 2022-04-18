const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    title: String,
})

module.exports = mongoose.model("Plan", PlanSchema);