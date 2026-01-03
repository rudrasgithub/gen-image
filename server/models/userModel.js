import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    creditBalance: { type: Number, default: 5 },
    generatedImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'image' }],
    totalImagesGenerated: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

const userModel = mongoose.models.user || new mongoose.model("user", userSchema);

export default userModel;