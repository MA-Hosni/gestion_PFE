import Joi from "joi";

const phoneNumberPattern = new RegExp("^(\+216|00216|216)?[0-9]{8}$|^(\+216|00216|216)?\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/");
const passwordPattern = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$"
);

const degreeToTypes = {
  Engineer: ["INLOG", "INREV"],
  Master: ["Pro IM", "Pro DCA", "Pro PAR", "R DISR", "R TMAC"],
  Bachelor: ["AV", "CMM", "IMM", "BD", "MIME", "Coco-JV", "Coco-3D"]
};


export const baseUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(60).required().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name cannot exceed 60 characters',
    'any.required': 'Full name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  phoneNumber: Joi.string().pattern(phoneNumberPattern).required().messages({
    'string.pattern.base': 'Phone number must be a valid Tunisian number (8 digits or formatted)',
    'any.required': 'Phone number is required'
  }),
  password: Joi.string().min(6).pattern(passwordPattern).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid("Student", "CompSupervisor", "UniSupervisor").required().messages({
    'any.only': 'Role must be one of: Student, CompSupervisor, UniSupervisor',
    'any.required': 'Role is required'
  })
});

export const studentSignupSchema = baseUserSchema.keys({
  cin: Joi.string().pattern(/^\d{8}$/).required().messages({
    'string.pattern.base': 'CIN must be exactly 8 digits',
    'any.required': 'ID card number is required'
  }),
  studentIdCardIMG: Joi.string().required().messages({
    'any.required': 'student university card image is required'
  }),
  degree: Joi.string().valid("Bachelor", "Master", "Engineer").required().messages({
    'any.only': 'Degree must be one of: Bachelor, Master, Engineer',
    'any.required': 'Degree is required'
  }),
  degreeType: Joi.string().required().messages({
    'any.required': 'Degree type is required'
  }),
  companyName: Joi.string().required().messages({
    'any.required': 'Company of internship is required'
  })
}).custom((value, helpers) => {
  if (value.role && value.role !== "Student") {
    return helpers.error('any.invalid', { message: 'Role must be Student for student signup' });
  }

  if (value.degree === "Engineer") {
    const validEngineerTypes = ["INLOG", "INREV"];
    if (!validEngineerTypes.includes(value.degree_type)) {
      return helpers.error('any.invalid', { 
        message: 'degree_type must be either \'INLOG\' or \'INREV\'' 
      });
    }
  } else if (value.degree === "Master") {
    const validMasterTypes = ["Pro IM", "Pro DCA", "Pro PAR", "R DISR", "R TMAC"];
    if (!validMasterTypes.includes(value.degree_type)) {
      return helpers.error('any.invalid', { 
        message: 'degree_type must be one of: \'Pro IM\', \'Pro DCA\', \'Pro PAR\', \'R DISR\', \'R TMAC\'' 
      });
    }
  } else if (value.degree === "Bachelor") {
    const validBachelorTypes = ["AV", "CMM", "IMM", "BD", "MIME", "Coco-JV", "Coco-3D"];
    if (!validBachelorTypes.includes(value.degree_type)) {
      return helpers.error('any.invalid', { 
        message: 'degree_type must be one of: \'AV\', \'CMM\', \'IMM\', \'BD\', \'MIME\', \'Coco-JV\', \'Coco-3D\'' 
      });
    }
  }

  return { ...value, role: "Student" };
});

export const companySupervisorSignupSchema = baseUserSchema.keys({
  companyName: Joi.string().required().messages({
    'any.required': 'Company name is required'
  }),
  badgeIMG: Joi.string().required().messages({
    'any.required': 'Working badge image is required'
  })
}).custom((value, helpers) => {
  if (value.role && value.role !== "CompSupervisor") {
    return helpers.error('any.invalid', { message: 'Role must be CompSupervisor for company supervisor signup' });
  }
  return { ...value, role: "CompSupervisor" };
});

export const universitySupervisorSignupSchema = baseUserSchema.keys({
  badgeIMG: Joi.string().required().messages({
    'any.required': 'University badge image is required'
  })
}).custom((value, helpers) => {
  if (value.role && value.role !== "UniSupervisor") {
    return helpers.error('any.invalid', { message: 'Role must be UniSupervisor for university supervisor signup' });
  }
  return { ...value, role: "UniSupervisor" };
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const emailVerificationSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Verification token is required'
  })
});

export const passwordResetSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  })
});

export const passwordUpdateSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  })
});
