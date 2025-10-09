import Joi from "joi";

export const projectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('').max(10000).messages({
    'string.max': 'Description cannot exceed 10000 characters'
  }),
  start_date: Joi.string().pattern(datePattern).required().messages({
    'string.pattern.base': 'Start date must be in YYYY-MM-DD format',
    'any.required': 'Start date is required'
  }),
  end_date: Joi.string().pattern(datePattern).required().messages({
    'string.pattern.base': 'End date must be in YYYY-MM-DD format',
    'any.required': 'End date is required'
  }),
  team_members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).messages({
    'string.pattern.base': 'Each team member must be a valid user ID'
  }),
  comp_supervisor: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Company supervisor must be a valid user ID',
    'any.required': 'Company supervisor is required'
  }),
  academic_supervisor: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Academic supervisor must be a valid user ID',
    'any.required': 'Academic supervisor is required'
  }),
  sprints: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).messages({
    'string.pattern.base': 'Each sprint must be a valid sprint ID'
  }),
  reports: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).messages({
    'string.pattern.base': 'Each report must be a valid report ID'
  })
}).custom((value, helpers) => {
  if (value.start_date && value.end_date) {
    if (value.end_date <= value.start_date) {
      return helpers.error('any.invalid', { message: 'End date must be after start date' });
    }
  }
  return value;
});