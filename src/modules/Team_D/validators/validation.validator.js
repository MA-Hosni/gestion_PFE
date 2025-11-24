import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const ValidationSchema = Joi.object({
  task_id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Task ID must be a valid ObjectId',
      'any.required': 'Task ID is required'
    }),

  status: Joi.string()
    .valid('valid', 'invalid')
    .required()
    .messages({
      'any.only': 'Status must be valid or invalid',
      'any.required': 'Status is required'
    }),

  validator_id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Validator ID must be a valid ObjectId',
      'any.required': 'Validator ID is required'
    }),

  meeting_type: Joi.string()
    .valid('reunion', 'hors_reunion')
    .required()
    .messages({
      'any.only': 'Meeting type must be reunion or hors_reunion',
      'any.required': 'Meeting type is required'
    }),

  meeting_reference: Joi.string()
    .pattern(objectIdPattern)
    .allow(null)
    .messages({
      'string.pattern.base': 'Meeting reference must be a valid ObjectId or null'
    }),

  comment: Joi.string().allow('').max(2000).messages({
    'string.max': 'Comment cannot exceed 2000 characters'
  })
});
