import mongoose from 'mongoose';
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        required: [true, 'Enter a username'],
        unique: [true, 'That username is taken.'],
        lowercase: true,
        validate: [validator.isAlphanumeric, 'Usernames may only have letters and numbers']
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minLength: [4, 'Password should be at least four characters']
    },
    urlImg: String,
    admin: {
        type: Boolean,
        default: false
    },
});

//schema middleware to apply before saving
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hashSync(this.password, 12);
    next();
});

export default mongoose.models.users || mongoose.model('users', userSchema);