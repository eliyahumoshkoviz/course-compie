import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    description: String,
    cpmpleted: Boolean,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }


});

export const taskModel = mongoose.model("task", taskSchema);


