import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/genimage`)
        .then(() => console.log("Db connected"))
        .catch((e) => console.log(e))
}

export default connectDB;