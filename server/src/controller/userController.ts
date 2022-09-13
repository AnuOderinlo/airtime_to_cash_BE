import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserInstance } from '../model/userModel'
import { options, generateToken, loginUserSchema } from "../utility/utilis";
import bcrypt from 'bcryptjs'
  
  export async function loginUser(req: Request, res: Response) {
    try {        
        const { username, email, password } = req.body;
  
        const validationResult = loginUserSchema.validate(req.body, options)
        
        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message })
        }
  
        let User;
        if (username) {
          User = await UserInstance.findOne({ where: { username: username } }) as unknown as { [key: string]: string }
        } else if (email) {
          User = await UserInstance.findOne({ where: { email: email } }) as unknown as { [key: string]: string }
        } else {
          return res.json({message: "Username or email is required"})
        }
        
        const id = User.id;
        
        const token = generateToken({ id });
               
        const validUser = await bcrypt.compare(password, User.password)

        if (!validUser) {
            return res.status(401).json({ message: "Password do not match" })
        }

        return res.status(200).json({ message: "Login successful", token, User })
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'failed to login user',
            route: '/login'
        })
    }
  }

  
  
  
