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

export const UpdateProjectSchema = Joi.object({
  title: Joi.string().min(3).max(200).messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 200 characters'
  }),
  description: Joi.string().allow('').max(2000).messages({
    'string.max': 'Description cannot exceed 2000 characters'
  }),
  startDate: Joi.date().iso().messages({
    'date.format': 'Start date must be a valid ISO date'
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).messages({
    'date.format': 'End date must be a valid ISO date',
    'date.min': 'End date must be after start date'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const AddRemoveContributorsSchema = Joi.object({
  projectId: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'Project ID must be a valid ID',
    'any.required': 'Project ID is required'
  }),
  studentIds: Joi.array().items(
    Joi.string().pattern(objectIdPattern).messages({
      'string.pattern.base': 'Each student ID must be a valid ID'
    })
  ).required().messages({
    'array.base': 'Student IDs must be an array',
    'any.required': 'Student IDs are required'
  })
});