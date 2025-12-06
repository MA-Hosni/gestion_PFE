import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// CREATE REPORT
export const createReportSchema = Joi.object({
  versionLabel: Joi.number().integer().min(1).required().messages({
    "number.base": "Version label must be a number",
    "number.min": "Version label must be at least 1",
    "any.required": "Version label is required",
  }),

  notes: Joi.string().min(3).max(5000).required().messages({
    "string.min": "Notes must be at least 3 characters",
    "any.required": "Notes are required",
  }),
});

// UPDATE REPORT
export const updateReportSchema = Joi.object({

  notes: Joi.string().min(3).max(5000).required().messages({
    "string.min": "Notes must be at least 3 characters",
    "string.max": "Notes must not exceed 5000 characters",
    "any.required": "Notes are required",
  }),
});