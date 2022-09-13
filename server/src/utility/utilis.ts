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

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
