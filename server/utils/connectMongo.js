import mongoose from "mongoose";

const connectMongo = () => {
    try{
        return mongoose.connect(
            process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI_ATLAS,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
    } catch (error) {
        console.log(`Error connecting to Mongoose: ${error.message}`)
    }
}

export default connectMongo;