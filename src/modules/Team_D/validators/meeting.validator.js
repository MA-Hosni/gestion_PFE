import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const MeetingSchema = Joi.object({
  scheduled_date: Joi.date().iso().required().messages({
    'date.format': 'Scheduled date must be a valid ISO date',
    'any.required': 'Scheduled date is required'
  }),

  agenda: Joi.string().allow('').max(2000).messages({
    'string.max': 'Agenda cannot exceed 2000 characters'
  }),

  actual_minutes: Joi.string().allow('').max(5000).messages({
    'string.max': 'Actual minutes cannot exceed 5000 characters'
  }),

  reference_type: Joi.string()
    .valid('user_story', 'task', 'report')
    .required()
    .messages({
      'any.only': 'Reference type must be one of user_story, task, or report',
      'any.required': 'Reference type is required'
    }),

  reference_id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Reference ID must be a valid ObjectId',
      'any.required': 'Reference ID is required'
    }),

  created_by: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Created by must be a valid student ID',
      'any.required': 'Created by is required'
    }),

  validation_status: Joi.string()
    .valid('pending', 'valid', 'invalid')
    .default('pending')
    .messages({
      'any.only': 'Validation status must be pending, valid, or invalid'
    })
});
