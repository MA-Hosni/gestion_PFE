import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const SprintSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 150 characters',
    'any.required': 'Title is required'
  }),
  goal: Joi.string().min(3).max(1000).required().messages({
    'string.min': 'Goal must be at least 3 characters long',
    'string.max': 'Goal cannot exceed 1000 characters',
    'any.required': 'Goal is required'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.format': 'Start date must be a valid ISO date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
    'date.format': 'End date must be a valid ISO date',
    'date.min': 'End date must be after start date',
    'any.required': 'End date is required'
  })
});

export const updateSprintSchema = Joi.object({
  title: Joi.string().min(3).max(150).messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 150 characters'
  }),
  goal: Joi.string().min(3).max(1000).messages({
    'string.min': 'Goal must be at least 3 characters long',
    'string.max': 'Goal cannot exceed 1000 characters'
  }),
  startDate: Joi.date().iso().messages({
    'date.format': 'Start date must be a valid ISO date'
  }),
  endDate: Joi.date().iso().messages({
    'date.format': 'End date must be a valid ISO date'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
}).custom((value, helpers) => {
  if (value.startDate && value.endDate) {
    if (new Date(value.endDate) <= new Date(value.startDate)) {
      return helpers.error('any.invalid', { message: 'End date must be after start date' });
    }
  }
  return value;
});

export const reorderSprintsSchema = Joi.object({
  sprints: Joi.array().items(
    Joi.object({
      sprintId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid sprint ID format',
        'any.required': 'Sprint ID is required'
      }),
      orderIndex: Joi.number().integer().min(1).required().messages({
        'number.integer': 'Order index must be an integer',
        'number.min': 'Order index must be at least 1',
        'any.required': 'Order index is required'
      })
    })
  ).min(1).required().unique('sprintId').unique('orderIndex').messages({
    'array.min': 'At least one sprint must be provided',
    'any.required': 'Sprints array is required'
  })
});