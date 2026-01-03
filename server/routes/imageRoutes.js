import { Router } from "express";
import userAuth from "../middlewares/auth.js";
import { 
    generateImage, 
    getImageHistory, 
    toggleFavorite, 
    deleteImage, 
    getFavoriteImages,
    debugGetHistory,
    getImageRaw
} from '../controllers/imageController.js'

const imageRouter = Router();

imageRouter.post('/generate-image', userAuth, generateImage)
imageRouter.get('/history', userAuth, getImageHistory)
imageRouter.get('/favorites', userAuth, getFavoriteImages)
imageRouter.post('/toggle-favorite', userAuth, toggleFavorite)
imageRouter.post('/delete-image', userAuth, deleteImage)

// Serve raw image bytes (authenticated)
imageRouter.get('/raw/:imageId', userAuth, getImageRaw)

// Debug route (no auth) - development only
imageRouter.get('/debug/:userId', debugGetHistory)

export default imageRouter;