import Joi from "joi";
import jwt from "jsonwebtoken";


export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase(),
    username: Joi.string().trim().lowercase(),
    password: Joi.string().required()
})

export const generateToken = (user: Record<string, unknown>): unknown => {
  const passPhrase = process.env.JWT_SECRET as string
  return jwt.sign(user, passPhrase, { expiresIn: '7d' })
}

export const registerUserSchema = Joi.object()
  .keys({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    username: Joi.string().trim().required(),
    email: Joi.string().trim().lowercase().required(),
    phoneNumber: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    avatar: Joi.string(),
    isVerified: Joi.boolean(),
    confirm_password: Joi.ref('password'),
  })
  .with('password', 'confirm_password');

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
