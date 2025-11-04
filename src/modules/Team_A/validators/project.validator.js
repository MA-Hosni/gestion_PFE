import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const ProjectSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('').max(2000).messages({
    'string.max': 'Description cannot exceed 2000 characters'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.format': 'Start date must be a valid ISO date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
    'date.format': 'End date must be a valid ISO date',
    'date.min': 'End date must be after start date',
    'any.required': 'End date is required'
  }),
  contributors: Joi.array().items(
    Joi.string().pattern(objectIdPattern).messages({
      'string.pattern.base': 'Each contributor must be a valid student ID'
    })
  ).default([]).messages({
    'array.base': 'Contributors must be an array'
  })
});