import { userModel } from '../DL/models/user.model.js';
import { taskModel } from '../DL/models/task.model.js';

const schema = {
    user: userModel,
    task: taskModel
};

export const getModel = (baseUrl) => schema[(baseUrl).slice(1)];
