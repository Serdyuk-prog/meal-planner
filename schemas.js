const Joi = require("joi");

module.exports.planSchema = Joi.object({
    plan: Joi.object({
        title: Joi.string().required(),
    }).required(),
});

// module.exports.dayPlanSchema = Joi.object({
//     dayPlan: Joi.object({
//         dayNumber: Joi.number().required().min(0).max(6),
//     }).required(),
// });

module.exports.mealSchema = Joi.object({
    meal: Joi.object({
        name: Joi.string().required(),
        dish: Joi.string().required(),
        ingredients: Joi.string().required(),
        cost: Joi.number().required().min(0),
    }).required(),
});

