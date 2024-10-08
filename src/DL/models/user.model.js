import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { createToken } from "../../middleware/auth.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        // unique:true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Eroor('Email is invalide');
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.includes('password')) throw new Eroor(`password con't contain "password`);
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;    
    const token = createToken({ _id: user._id.toString() })
    user.tokens.push({token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await userModel.findOne({ email })
    if (!user) throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')
    return user
}


userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8)
    next()
})


export const userModel = mongoose.model("user", userSchema);
