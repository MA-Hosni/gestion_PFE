import Joi from "joi";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const sprintSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required'
  }),
  goal: Joi.string().allow('').max(1000).required().messages({
    'string.max': 'Goal cannot exceed 1000 characters',
    'any.required': 'Goal is required'
  }),
  startDate: Joi.string().pattern(datePattern).required().messages({
    'string.pattern.base': 'Start date must be in YYYY-MM-DD format',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.string().pattern(datePattern).required().messages({
    'string.pattern.base': 'End date must be in YYYY-MM-DD format',
    'any.required': 'End date is required'
  }),
  orderIndex: Joi.number().integer().min(1).required().messages({
    'number.integer': 'Order index must be an integer',
    'number.min': 'Order index must be at least 1',
    'any.required': 'Order index is required'
  }),
  // userStories: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).messages({
  //   'string.pattern.base': 'Each user story must be a valid user story ID'
  // })
}).custom((value, helpers) => {
  if (value.start_date && value.end_date) {
    if (value.end_date <= value.start_date) {
      return helpers.error('any.invalid', { message: 'End date must be after start date' });
    }
  }
  return value;
});