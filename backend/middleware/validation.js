const Joi = require("joi");

// Password validation - minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
const passwordSchema = Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
    "any.required": "Password is required",
  });

// Login validation
const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(50).messages({
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username cannot exceed 50 characters",
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Registration request validation
const requestAccessSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50).trim().messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().min(2).max(50).trim().messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
});

// Complete registration validation
const completeRegistrationSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50).trim(),
  lastName: Joi.string().required().min(2).max(50).trim(),
  username: Joi.string().required().min(3).max(30).alphanum().trim().messages({
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username cannot exceed 30 characters",
    "string.alphanum": "Username must only contain alphanumeric characters",
    "any.required": "Username is required",
  }),
  password: passwordSchema,
});

// Full registration validation
const registerSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50).trim(),
  lastName: Joi.string().required().min(2).max(50).trim(),
  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(10)
    .max(20)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "string.min": "Phone number must be at least 10 characters",
    }),
  city: Joi.string().required().min(2).max(50).trim(),
  country: Joi.string().required().min(2).max(50).trim(),
  username: Joi.string().required().min(3).max(30).alphanum().trim(),
  password: passwordSchema,
});

// Profile update validation
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).trim(),
  lastName: Joi.string().min(2).max(50).trim(),
  email: Joi.string().email().trim(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(10)
    .max(20),
  city: Joi.string().min(2).max(50).trim(),
  country: Joi.string().min(2).max(50).trim(),
  profilePhoto: Joi.string().allow(null), // Allow base64 image string of any size
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Course validation
const courseSchema = Joi.object({
  title: Joi.string().required().min(3).max(200).trim().messages({
    "string.min": "Course title must be at least 3 characters",
    "string.max": "Course title cannot exceed 200 characters",
    "any.required": "Course title is required",
  }),
  description: Joi.string().allow("").max(2000).trim().messages({
    "string.min": "Course description must be at least 10 characters",
    "string.max": "Course description cannot exceed 2000 characters",
  }),
  courseType: Joi.string()
    .valid("academic", "professional", "short-term", "projects", "both")
    .default("academic")
    .messages({
      "any.only":
        "Course type must be academic, professional, short-term, projects, or both",
    }),
  descriptionPdf: Joi.string().allow("").max(45000000).messages({
    "string.max": "Description PDF is too large. Please upload a smaller file.",
  }),
  contentHours: Joi.number().required().min(0).messages({
    "number.base": "Course hours must be a valid number",
    "number.min": "Course hours cannot be negative",
    "any.required": "Course hours are required",
  }),
  image: Joi.string().optional().max(5000000), // Base64 encoded image
  assignedTeachers: Joi.array().items(Joi.string()),
  completionDate: Joi.date(),
});

// Chapter validation
const MAX_MODULE_IMAGE_BASE64_LENGTH = 8 * 1024 * 1024;
const chapterSchema = Joi.object({
  title: Joi.string().required().min(3).max(200).trim().messages({
    "string.min": "Chapter title must be at least 3 characters",
    "string.max": "Chapter title cannot exceed 200 characters",
    "any.required": "Chapter title is required",
  }),
  moduleDescriptionPdf: Joi.string().allow("").max(45000000).messages({
    "string.max":
      "Module description PDF is too large. Please upload a smaller file.",
  }),
  moduleImage: Joi.string()
    .allow("")
    .optional()
    .max(MAX_MODULE_IMAGE_BASE64_LENGTH)
    .messages({
      "string.max": "Module image is too large. Please upload a smaller image.",
    }),
});

// Unit validation
const unitSchema = Joi.object({
  title: Joi.string().required().min(3).max(200).trim(),
  type: Joi.string().valid("video", "pdf", "text", "quiz").required().messages({
    "any.only": "Unit type must be one of: video, pdf, text, quiz",
    "any.required": "Unit type is required",
  }),
  content: Joi.object({
    videoUrl: Joi.string().uri().allow(""),
    pdfUrl: Joi.string().allow("").max(45000000).messages({
      "string.max": "PDF content is too large. Please upload a smaller file.",
    }),
    text: Joi.string().allow(""),
    quiz: Joi.string().allow(""),
  }),
});

// Unit update validation (type is optional for updates)
const updateUnitSchema = Joi.object({
  title: Joi.string().optional().min(3).max(200).trim(),
  type: Joi.string().valid("video", "pdf", "text", "quiz").optional(),
  content: Joi.object({
    videoUrl: Joi.string().uri().allow(""),
    pdfUrl: Joi.string().allow("").max(45000000).messages({
      "string.max": "PDF content is too large. Please upload a smaller file.",
    }),
    text: Joi.string().allow(""),
    quiz: Joi.string().allow(""),
  }).optional(),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
        debugBodyKeys: Object.keys(req.body || {}),
        debugSchemaKeys:
          schema && typeof schema.describe === "function"
            ? Object.keys(schema.describe().keys || {})
            : [],
      });
    }

    next();
  };
};

module.exports = {
  validate,
  loginSchema,
  requestAccessSchema,
  completeRegistrationSchema,
  registerSchema,
  updateProfileSchema,
  courseSchema,
  chapterSchema,
  unitSchema,
  updateUnitSchema,
};
