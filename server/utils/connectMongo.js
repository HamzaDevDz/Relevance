import mongoose from "mongoose";

const connectMongo = () => {
    try{
        return mongoose.connect(
            process.env.PORT || process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
    } catch (error) {
        console.log(`Error connecting to Mongoose: ${error.message}`)
    }
}

export default connectMongo;