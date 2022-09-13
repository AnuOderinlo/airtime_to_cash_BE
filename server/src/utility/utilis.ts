import Joi from 'joi';
import jwt from 'jsonwebtoken';

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

export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const secret = process.env.JWT_SECRET as string;
  const expires = process.env.JWT_EXPIRES_IN;

  console.log(process.env);

  console.log(jwt.sign(user, secret, { expiresIn: expires }));
  return jwt.sign(user, secret, { expiresIn: expires });
};

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};
