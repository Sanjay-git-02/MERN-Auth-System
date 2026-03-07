import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getUserData } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/get-user",authMiddleware,getUserData)

export default userRouter;