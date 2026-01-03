import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import FormData from 'form-data'
import axios from 'axios'

export const generateImage = async (req, res) => {
    try {
        const { userId } = req;
        const { prompt } = req.body;
        
        console.log('🔍 Generating image for userId:', userId, 'prompt:', prompt);
        
        if (!userId || !prompt) {
            return res.json({ success: false, message: 'Missing Fields' })
        }

        // Fetch user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        console.log('💰 User credit balance:', user.creditBalance);

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: 'No Credit balance', creditBalance: user.creditBalance })
        }
        
        const startTime = Date.now();
        
        const formData = new FormData()
        formData.append('prompt', prompt)

        console.log('📡 Calling Clipdrop API...');

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIP_DROP_API,
            },
            responseType: 'arraybuffer'
        })
        
        const generationTime = Date.now() - startTime;
        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`

        console.log('✅ Image generated in', generationTime, 'ms');

        // Create image document
        const newImage = new imageModel({
            userId: user._id,
            prompt: prompt,
            imageUrl: resultImage,
            generationTime: generationTime,
            model: 'clipdrop',
            isFavorite: false
        });

        console.log('💾 Saving image to database...');
        const savedImage = await newImage.save();
        console.log('✅ Image saved with ID:', savedImage._id);

        // Update user's generatedImages array and counter
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id, 
            {
                creditBalance: user.creditBalance - 1,
                $push: { generatedImages: savedImage._id },
                totalImagesGenerated: (user.totalImagesGenerated || 0) + 1
            },
            { new: true }
        );
        
        console.log('✅ User updated. New credit balance:', updatedUser.creditBalance);

        res.json({ 
            success: true, 
            message: 'Image generated', 
            creditBalance: updatedUser.creditBalance, 
            resultImage,
            imageId: savedImage._id 
        })
    } catch (err) {
        console.error('❌ Error in generateImage:', err.message);
        res.json({ success: false, message: err.message })
    }
}

// Get user's image history
export const getImageHistory = async (req, res) => {
    try {
        const { userId } = req;
        
        console.log('🔍 Fetching history for userId:', userId);

        if (!userId) {
            return res.json({ success: false, message: 'User not authenticated' })
        }

        const images = await imageModel
            .find({ userId })
            .sort({ createdAt: -1 });

        console.log('✅ Found', images.length, 'images');

        res.json({ 
            success: true, 
            images: images,
            total: images.length 
        })
    } catch (err) {
        console.error('❌ Error in getImageHistory:', err.message);
        res.json({ success: false, message: err.message })
    }
}

// Toggle favorite image
export const toggleFavorite = async (req, res) => {
    try {
        const { userId } = req;
        const { imageId } = req.body;

        console.log('🔍 Toggling favorite for imageId:', imageId);

        const image = await imageModel.findById(imageId);

        if (!image) {
            return res.json({ success: false, message: 'Image not found' })
        }

        if (image.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        image.isFavorite = !image.isFavorite;
        await image.save();

        console.log('✅ Favorite toggled to:', image.isFavorite);

        res.json({ 
            success: true, 
            message: image.isFavorite ? 'Added to favorites' : 'Removed from favorites',
            isFavorite: image.isFavorite 
        })
    } catch (err) {
        console.error('❌ Error in toggleFavorite:', err.message);
        res.json({ success: false, message: err.message })
    }
}

// Delete image from history
export const deleteImage = async (req, res) => {
    try {
        const { userId } = req;
        const { imageId } = req.body;

        console.log('🔍 Deleting image:', imageId);

        const image = await imageModel.findById(imageId);

        if (!image) {
            return res.json({ success: false, message: 'Image not found' })
        }

        if (image.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        await imageModel.findByIdAndDelete(imageId);
        await userModel.findByIdAndUpdate(userId, {
            $pull: { generatedImages: imageId }
        })

        console.log('✅ Image deleted successfully');

        res.json({ success: true, message: 'Image deleted' })
    } catch (err) {
        console.error('❌ Error in deleteImage:', err.message);
        res.json({ success: false, message: err.message })
    }
}

// Get favorite images
export const getFavoriteImages = async (req, res) => {
    try {
        const { userId } = req;

        console.log('🔍 Fetching favorites for userId:', userId);

        const images = await imageModel
            .find({ userId, isFavorite: true })
            .sort({ createdAt: -1 });

        console.log('✅ Found', images.length, 'favorite images');

        res.json({ 
            success: true, 
            images: images,
            total: images.length 
        })
    } catch (err) {
        console.error('❌ Error in getFavoriteImages:', err.message);
        res.json({ success: false, message: err.message })
    }
}

// DEBUG: get history by userId without auth (only for development)
export const debugGetHistory = async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ success: false, message: 'Not allowed in production' })
        }

        const { userId } = req.params;
        console.log('🔧 Debug fetch history for userId:', userId);

        const images = await imageModel
            .find({ userId })
            .sort({ createdAt: -1 });

        console.log('🔧 Debug found', images.length, 'images');

        res.json({ success: true, images, total: images.length })
    } catch (err) {
        console.error('❌ Error in debugGetHistory:', err.message);
        res.json({ success: false, message: err.message })
    }
}

// Serve raw image bytes for a saved image (handles data URLs and external URLs)
export const getImageRaw = async (req, res) => {
    try {
        const { userId } = req;
        const { imageId } = req.params;

        console.log('🔍 Serving raw image for imageId:', imageId, 'requested by userId:', userId);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' })
        }

        const image = await imageModel.findById(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' })
        }

        if (image.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' })
        }

        const url = image.imageUrl;
        if (!url) {
            return res.status(404).json({ success: false, message: 'No image data available' })
        }

        // If stored as data URL: data:<mime>;base64,<data>
        if (typeof url === 'string' && url.startsWith('data:')) {
            const match = url.match(/^data:(image\/[^;]+);base64,(.+)$/);
            if (!match) {
                console.error('❌ getImageRaw: data URL parse failed');
                return res.status(500).json({ success: false, message: 'Stored image is in unexpected format' })
            }

            const mime = match[1];
            const b64 = match[2];
            const buffer = Buffer.from(b64, 'base64');

            res.setHeader('Content-Type', mime);
            res.setHeader('Content-Length', buffer.length);
            return res.send(buffer);
        }

        // If it's an external URL, redirect the client to that URL
        if (typeof url === 'string') {
            console.log('🔁 getImageRaw: redirecting to external URL');
            return res.redirect(url);
        }

        // Fallback
        return res.status(500).json({ success: false, message: 'Unable to serve image' })
    } catch (err) {
        console.error('❌ Error in getImageRaw:', err.message);
        return res.status(500).json({ success: false, message: err.message })
    }
}