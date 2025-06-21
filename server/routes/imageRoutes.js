import { Router } from "express";
import userAuth from "../middlewares/auth.js";
import { generateImage } from '../controllers/imageController.js'

const imageRouter = Router();

imageRouter.post('/generate-image', userAuth, generateImage)

export default imageRouter;