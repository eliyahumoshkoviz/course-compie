import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { userModel } from '../DL/models/user.model.js';

const SECRET = process.env.SECRET;


export const createToken = (data = {}) => {
    return jwt.sign(data, SECRET, { expiresIn: '1h' })
}


export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        const decoded = jwt.verify(token, SECRET);
        const user = await userModel.findOne({ _id: decoded._id, 'tokens.token': token });      

        if (!user) throw new Error();
        
        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({ error: 'Unauthorized access' });
    }
}
