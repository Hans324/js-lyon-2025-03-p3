import type { RequestHandler } from "express";
import Joi from "joi";

export const validateCreateUser: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(50).trim().required(),
    lastname: Joi.string().min(2).max(50).trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
  });

  if (error) {
    console.warn("User validation failed:", error.details[0].message);

    res.status(400).json({
      message: "Validation error",
      error: error.details[0].message,
    });
    return;
  }

  console.info("User validation successful");

  next();
};
