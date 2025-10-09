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
  full_name: Joi.string().min(2).max(60).required().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name cannot exceed 60 characters',
    'any.required': 'Full name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  phone_number: Joi.string().pattern(phoneNumberPattern).required().messages({
    'string.pattern.base': 'Phone number must be a valid Tunisian number (8 digits or formatted)',
    'any.required': 'Phone number is required'
  }),
  password: Joi.string().min(6).pattern(passwordPattern).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid("Student", "Enc_Company", "Enc_University").required().messages({
    'any.only': 'Role must be one of: Student, Enc_Company, Enc_University',
    'any.required': 'Role is required'
  })
});

export const studentSignupSchema = baseUserSchema.keys({
  cin: Joi.string().required().messages({
    'any.required': 'ID card number is required'
  }),
  student_id_card_img: Joi.string().required().messages({
    'any.required': 'student university card image is required'
  }),
  degree: Joi.string().valid("Bachelor", "Master", "Engineer").required().messages({
    'any.only': 'Degree must be one of: Bachelor, Master, Engineer',
    'any.required': 'Degree is required'
  }),
  degree_type: Joi.string().required().messages({
    'any.required': 'Degree type is required'
  }),
  company_name: Joi.string().required().messages({
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
  company_name: Joi.string().required().messages({
    'any.required': 'Company name is required'
  }),
  badge_img: Joi.string().required().messages({
    'any.required': 'Working badge image is required'
  })
}).custom((value, helpers) => {
  if (value.role && value.role !== "Enc_Company") {
    return helpers.error('any.invalid', { message: 'Role must be Enc_Company for company supervisor signup' });
  }
  return { ...value, role: "Enc_Company" };
});

export const universitySupervisorSignupSchema = baseUserSchema.keys({
  admin: Joi.boolean().optional().default(false),
  badge_img: Joi.string().required().messages({
    'any.required': 'University badge image is required'
  })
}).custom((value, helpers) => {
  if (value.role && value.role !== "Enc_University") {
    return helpers.error('any.invalid', { message: 'Role must be Enc_University for university supervisor signup' });
  }
  return { ...value, role: "Enc_University" };
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
