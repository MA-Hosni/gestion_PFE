// // Team_D/validators/meeting.validator.js
import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const MeetingSchema = Joi.object({
  scheduledDate: Joi.date().iso().required().messages({
    "date.format": "Scheduled date must be a valid ISO date",
    "any.required": "Scheduled date is required",
  }),

  agenda: Joi.string().allow("").max(2000).messages({
    "string.max": "Agenda cannot exceed 2000 characters",
  }),

  actualMinutes: Joi.string().allow("").max(5000).messages({
    "string.max": "Actual minutes cannot exceed 5000 characters",
  }),

  referenceType: Joi.string()
    .valid("user_story", "task", "report")
    .required()
    .messages({
      "any.only": "Reference type must be one of user_story, task, or report",
      "any.required": "Reference type is required",
    }),

  referenceId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      "string.pattern.base": "Reference ID must be a valid ObjectId",
      "any.required": "Reference ID is required",
    }),

  validationStatus: Joi.string()
    .valid("pending", "valid", "invalid")
    .default("pending")
    .messages({
      "any.only": "Validation status must be pending, valid, or invalid",
    }),
});

/**
 * Individual schemas for routes that need slightly different validation rules.
 * These are exported so routes can import the specific schema they expect.
 */

export const CompleteMeetingSchema = Joi.object({
  actualMinutes: Joi.string().required().max(5000).messages({
    "any.required": "Actual minutes are required when completing the meeting",
    "string.max": "Actual minutes cannot exceed 5000 characters",
  }),
});

export const ValidateMeetingSchema = Joi.object({
  validationStatus: Joi.string().valid("valid", "invalid").required().messages({
    "any.only": "Validation status must be 'valid' or 'invalid'",
    "any.required": "Validation status is required",
  }),
});

export const ChangeReferenceSchema = Joi.object({
  referenceType: Joi.string()
    .valid("user_story", "task", "report")
    .required()
    .messages({
      "any.only": "Reference type must be user_story, task, or report",
      "any.required": "Reference Type is required",
    }),

  referenceId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      "string.pattern.base": "Reference ID must be a valid ObjectId",
      "any.required": "Reference ID is required",
    }),
});
