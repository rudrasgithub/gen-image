import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Base64 or URL
    createdAt: { type: Date, default: Date.now },
    isFavorite: { type: Boolean, default: false },
    tags: [{ type: String }], // For categorizing images
    generationTime: { type: Number }, // Time taken to generate in ms
    model: { type: String, default: 'clipdrop' } // API model used
});

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema);

export default imageModel;
