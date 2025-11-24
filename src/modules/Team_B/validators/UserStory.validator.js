import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const UserStorySchema = Joi.object({
    story_name: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'Story name must be at least 3 characters long',
            'string.max': 'Story name cannot exceed 200 characters',
            'any.required': 'Story name is required'
        }),

    description: Joi.string()
        .allow('')
        .max(2000)
        .messages({
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    priority: Joi.string()
        .valid('highest', 'high', 'medium', 'low', 'lowest')
        .default('medium')
        .messages({
            'any.only': 'Priority must be one of: highest, high, medium, low, lowest'
        }),

    story_point_estimate: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.min': 'Story point estimate must be a positive number',
            'any.required': 'Story point estimate is required'
        }),

    start_date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.format': 'Start date must be a valid ISO date',
            'any.required': 'Start date is required'
        }),

    due_date: Joi.date()
        .iso()
        .min(Joi.ref('start_date'))
        .required()
        .messages({
            'date.min': 'Due date must be after start date',
            'any.required': 'Due date is required'
        }),

    tasks: Joi.array()
        .items(
            Joi.string()
                .pattern(objectIdPattern)
                .messages({
                    'string.pattern.base': 'Each task must be a valid task ID'
                })
        )
        .default([])
        .messages({
            'array.base': 'Tasks must be an array'
        })
});
